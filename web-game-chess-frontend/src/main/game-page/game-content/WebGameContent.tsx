import { useEffect, useReducer } from "react";
import {
  EndWebGameDto,
  GetWebGameDto,
  GetWebGamePlayerDto,
  SearchWebGameDto,
  CreateWebGameRematchDto,
} from "../../../shared/utils/types/webGameDtos";
import classes from "./GameContent.module.scss";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import { EndWebGameModel, SearchWebGameModel } from "../../../shared/utils/types/webGameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { Guid } from "guid-typescript";
import { GameActionInterface, GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import { SMatrix, StateProp } from "../../../shared/utils/types/commonTypes";
import {
  gameInitialStates,
  gameStatesReducer,
  selectionInitialStates,
  selectionStatesReducer,
} from "./WebGameContentStates";
import { checkChecks, generateControlledAreas } from "../../../shared/utils/chess-game/controlledAreas";
import { checkIfAnyMoveExists } from "../../../shared/utils/chess-game/checkIfAnyMoveExists";
import { Coordinate, PieceOption } from "../../../shared/utils/chess-game/gameSates";
import { checkIfPlayerTurn } from "../../../shared/utils/chess-game/general";
import findMoves from "../../../shared/utils/chess-game/findMoves";
import WebGameSearching from "./game-searching/WebGameSearching";
import WebGameCoordinates from "./game-coordinates/WebGameCoordinates";
import WebGameBoard from "./game-board/WebGameBoard";
import WebGamePromotion from "./game-promotion/WebGamePromotion";
import WebGameConfirm from "./game-confirm/WebGameConfirm";
import WebGameWinner from "./game-winner/WebGameWinner";
import { MoveDto } from "../../../shared/utils/types/abstractDtosAndModels";
import GameHistory from "./game-history/GameHistory";
import GameSettings from "./game-settings/GameSettings";

type WebGameContentProps = {
  // game and player data
  gameId: Guid;
  gameData: GetWebGameDto;
  playerData: GetWebGamePlayerDto;
  // winner color if game is finished
  winner: EndWebGameDto | null;

  // timing of current game for new games and rematches
  selectedTiming: SearchWebGameModel | null;

  //
  historyPositionState: StateProp<MoveDto | null>;

  // obtained ids for rematch game and setter
  newGameDataState: StateProp<SearchWebGameDto | null>;

  //rematch game data
  rematchData: CreateWebGameRematchDto | null;

  // to display/hide confirm window
  showConfirmState: StateProp<GameActionInterface | null>;

  // to perform action on confirm
  confirmAction: () => void;

  // selected window modal to show/hide
  displayedWindowState: StateProp<GameWindowInterface>;
};

function WebGameContent({
  gameId,
  gameData,
  playerData,
  winner,
  selectedTiming,
  historyPositionState,
  newGameDataState,
  rematchData,
  showConfirmState,
  confirmAction,
  displayedWindowState,
}: WebGameContentProps) {
  ///

  // states of game and selections
  const [gameStates, setGameStates] = useReducer(gameStatesReducer, gameInitialStates);
  const [selectionStates, setSelectionStates] = useReducer(selectionStatesReducer, selectionInitialStates);

  useEffect(() => {
    setGameStates({ type: "SET_GAME_ID", payload: gameId });
  }, [gameId]);

  // after each move states update
  const updateStates = () => {
    const setMatrix = (position: string): SMatrix => {
      const matrix: SMatrix = [[]]; // containing first for

      let row: number = 0;
      for (let i = 0; i < position.length; i++) {
        const char = position[i];

        if (char == "/") {
          row++;
          matrix.push([]);
          continue;
        }

        if (!isNaN(parseInt(char))) {
          for (let j = 0; j < parseInt(char); j++) {
            matrix[row].push("");
          }
        } else {
          matrix[row].push(char);
        }
      }

      return matrix.reverse();
    };

    // set game matrix
    const matrix = setMatrix(gameData.position);
    setGameStates({ type: "SET_MATRIX", payload: matrix });

    // set controlled areas
    const [wControlled, bControlled] = generateControlledAreas(matrix);
    setGameStates({
      type: "SET_CONTROLLED_AREAS",
      payload: { white: wControlled, black: bControlled },
    });

    // set checked areas
    const [wChecked, bChecked] = checkChecks(matrix);
    setGameStates({
      type: "SET_CHECK_AREAS",
      payload: { white: wChecked, black: bChecked },
    });

    // clear selected piece and available fields (clear before mapping board)
    setSelectionStates({
      type: "SET_AVAILABLE_FIELDS",
      payload: [],
    });

    chosePiece("", null);
  };

  useEffect(() => {
    // set player data
    setGameStates({
      type: "SET_PLAYER_DATA",
      payload: playerData,
    });
  }, [playerData]);

  useEffect(() => {
    // set game data
    setGameStates({
      type: "SET_GAME_DATA",
      payload: gameData,
    });

    setTimeout(() => {
      updateStates();
    }, 100);
  }, [gameData]);

  // to check if game should end
  useEffect(() => {
    const endGame = async (loserColor: PieceColor | null, gameEndReason: GameEndReason) => {
      const loserPlayer: EndWebGameModel = {
        gameId: gameId,
        loserColor: loserColor,
        endGameType: gameEndReason,
      };

      GameHubService.EndGame(loserPlayer);
    };

    // end game if it has not been ended yet
    if (!gameData.hasEnded && gameStates.matrix.length > 0) {
      const noMove = checkIfAnyMoveExists(gameStates, selectionStates);

      if (noMove) {
        if (playerData.color === PieceColor.white && gameStates.checkAreas.black.length !== 0) {
          // white has been check mated
          endGame(playerData.color, GameEndReason.checkMate);
        } else if (playerData.color === PieceColor.black && gameStates.checkAreas.white.length !== 0) {
          // black has been check mated
          endGame(playerData.color, GameEndReason.checkMate);
        } else {
          // draw
          endGame(null, GameEndReason.staleMate);
        }
      }
    }
  }, [gameStates.matrix]);

  // set selected piece and corresponding coordinates
  const chosePiece = (piece: PieceOption, coordinates: Coordinate) => {
    if (checkIfPlayerTurn(gameData.turn, playerData.color)) {
      setSelectionStates({ type: "SET_PIECE", payload: piece });
      setSelectionStates({ type: "SET_COORDINATES", payload: coordinates });
    }
  };

  // set available fields each time user choses different filed
  useEffect(() => {
    const availableFields = findMoves.find(gameStates, selectionStates);

    setSelectionStates({
      type: "SET_AVAILABLE_FIELDS",
      payload: availableFields,
    });
  }, [selectionStates.coordinates]);

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        {/* game board */}
        <WebGameCoordinates playerData={playerData} />

        <WebGameBoard
          gameData={gameData}
          playerData={playerData}
          gameStates={gameStates}
          selectionStates={selectionStates}
          setSelectionStates={setSelectionStates}
          chosePiece={chosePiece}
          setDisplayedWindow={displayedWindowState.set}
        />
        {/* --- */}

        {/* promotion box */}
        {displayedWindowState.get === GameWindowInterface.promotion &&
          selectionStates.promotionCoor &&
          !gameData.hasEnded && (
            <WebGamePromotion
              playerData={playerData}
              gameStates={gameStates}
              selectionStates={selectionStates}
              setSelectionStates={setSelectionStates}
              setDisplayedWindow={displayedWindowState.set}
            />
          )}

        {/* confirm box */}
        {displayedWindowState.get === GameWindowInterface.confirm &&
          showConfirmState.get !== null &&
          !gameData.hasEnded && (
            <WebGameConfirm
              confirmAction={confirmAction}
              showConfirmState={showConfirmState}
              setDisplayedWindow={displayedWindowState.set}
            />
          )}

        {/* end game info*/}
        {displayedWindowState.get === GameWindowInterface.winner && winner && (
          <WebGameWinner
            gameId={gameId}
            gameData={gameData}
            playerData={playerData}
            winner={winner}
            selectedTiming={selectedTiming}
            setNewGameData={newGameDataState.set}
            rematchData={rematchData}
            setDisplayedWindow={displayedWindowState.set}
          />
        )}

        {/* previous position show */}
        {displayedWindowState.get === GameWindowInterface.history && (
          <GameHistory
            gameData={gameData}
            playerData={playerData}
            historyPositionState={historyPositionState}
            setDisplayedWindow={displayedWindowState.set}
          />
        )}

        {/* settings */}
        {displayedWindowState.get === GameWindowInterface.settings && (
          <GameSettings gameData={gameData} setDisplayedWindow={displayedWindowState.set} />
        )}

        {/* searching */}
        {displayedWindowState.get === GameWindowInterface.search && newGameDataState.get && (
          <WebGameSearching newGameDataState={newGameDataState} />
        )}
      </div>
    </section>
  );
}

export default WebGameContent;
