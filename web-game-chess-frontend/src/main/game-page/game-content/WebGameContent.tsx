import { Dispatch, SetStateAction, useEffect, useReducer } from "react";
import {
  EndGameDto,
  GetEndedGameDto,
  GetWebGameDto,
  GetPlayerDto,
  SearchWebGameDto,
  CreateRematchGameDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./GameContent.module.scss";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import { EndGameModel, SearchWebGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { Guid } from "guid-typescript";
import { GameActionInterface, GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import { SMatrix } from "../../../shared/utils/types/commonTypes";
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

type WebGameContentProps = {
  // game and player data
  gameId: Guid;
  gameData: GetWebGameDto;
  playerData: GetPlayerDto;
  // winner color if game is finished
  winner: EndGameDto | GetEndedGameDto | null;

  // timing of current game for new games and rematches
  selectedTiming: SearchWebGameModel | null;

  // obtained ids for rematch game and setter
  newGameData: SearchWebGameDto | null;
  setNewGameData: Dispatch<SetStateAction<SearchWebGameDto | null>>;

  //rematch game data
  rematchData: CreateRematchGameDto | null;

  // to display/hide confirm window
  showConfirm: GameActionInterface | null;
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;

  // to perform action on confirm
  confirmAction: () => void;

  // selected window modal to show/hide
  displayedWindow: GameWindowInterface;
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGameContent({
  gameId,
  gameData,
  playerData,
  winner,
  selectedTiming,
  newGameData,
  setNewGameData,
  rematchData,
  showConfirm,
  setShowConfirm,
  confirmAction,
  displayedWindow,
  setDisplayedWindow,
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
  //*/

  // to check if game should end
  useEffect(() => {
    const endGame = async (loserColor: PieceColor | null, gameEndReason: GameEndReason) => {
      const loserPlayer: EndGameModel = {
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
  //*/

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
  //*/

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
          setDisplayedWindow={setDisplayedWindow}
        />
        {/* --- */}

        {/* promotion box */}
        {displayedWindow === GameWindowInterface.promotion && selectionStates.promotionCoor && !gameData.hasEnded && (
          <WebGamePromotion
            playerData={playerData}
            gameStates={gameStates}
            selectionStates={selectionStates}
            setSelectionStates={setSelectionStates}
            setDisplayedWindow={setDisplayedWindow}
          />
        )}

        {/* confirm box */}
        {displayedWindow === GameWindowInterface.confirm && showConfirm !== null && !gameData.hasEnded && (
          <WebGameConfirm
            confirmAction={confirmAction}
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            setDisplayedWindow={setDisplayedWindow}
          />
        )}

        {/* end game info*/}
        {displayedWindow === GameWindowInterface.winner && winner && (
          <WebGameWinner
            gameId={gameId}
            gameData={gameData}
            playerData={playerData}
            winner={winner}
            selectedTiming={selectedTiming}
            setNewGameData={setNewGameData}
            rematchData={rematchData}
            setDisplayedWindow={setDisplayedWindow}
          />
        )}

        {/* searching */}
        {displayedWindow === GameWindowInterface.search && newGameData && (
          <WebGameSearching newGameData={newGameData} setNewGameData={setNewGameData} />
        )}
      </div>
    </section>
  );
}

export default WebGameContent;
