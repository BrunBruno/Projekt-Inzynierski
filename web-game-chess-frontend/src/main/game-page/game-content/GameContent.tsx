import { Dispatch, SetStateAction, useEffect, useReducer } from "react";
import {
  EndGameDto,
  GetEndedGameDto,
  GetGameDto,
  GetPlayerDto,
  SearchGameDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./GameContent.module.scss";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import { EndGameModel, SearchGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import GameBoardWinner from "./game-board-winner/GameBoardWinner";
import GameBoardPromotion from "./game-board-promotion/GameBoardPromotion";
import {
  gameInitialStates,
  gameStatesReducer,
  selectionInitialStates,
  selectionStatesReducer,
} from "./GameContentStates";
import GameBoardCoordinates from "./game-board-coordinates/GameBoardCoordinates";
import GameBoardSearching from "./game-board-searching/GameBoardSearching";
import { Guid } from "guid-typescript";
import GameBoardConfirm from "./game-board-confirm/GameBoardConfirm";
import { GameActionInterface } from "../../../shared/utils/objects/interfacesEnums";
import GameBoard from "./game-board/GameBoard";
import { Coordinate, PieceOption } from "../game-page-functions/types";
import { checkIfPlayerTurn } from "../game-page-functions/general";
import { checkChecks, generateControlledAreas } from "../game-page-functions/controlledAreas";
import { checkIfAnyMoveExists } from "../game-page-functions/checkIfAnyMoveExists";
import findMoves from "../game-page-functions/findMoves";
import { SMatrix } from "../../../shared/utils/types/commonTypes";

type GameContentProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetGameDto;
  // current player data
  playerData: GetPlayerDto;
  // winner color if game is finished
  winner: EndGameDto | GetEndedGameDto | null;
  // obtained ids for rematch game
  searchIds: SearchGameDto | null;
  //rematch game id
  newGameId: Guid | null;
  // setter of obtained ids
  setSearchIds: Dispatch<SetStateAction<SearchGameDto | null>>;
  // timing of current game
  selectedTiming: SearchGameModel | null;
  // to display confirm window
  showConfirm: GameActionInterface | null;
  // to hide confirm window
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // to perform action on confirm
  confirmAction: () => void;
};

function GameContent({
  gameId,
  gameData,
  playerData,
  winner,
  searchIds,
  newGameId,
  setSearchIds,
  selectedTiming,
  showConfirm,
  setShowConfirm,
  confirmAction,
}: GameContentProps) {
  ///

  // states of game
  const [gameStates, setGameStates] = useReducer(gameStatesReducer, gameInitialStates);
  const [selectionStates, setSelectionStates] = useReducer(selectionStatesReducer, selectionInitialStates);

  useEffect(() => {
    setGameStates({ type: "SET_GAME_ID", payload: gameId });
  }, [gameId]);

  //
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
  //*/

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
        <GameBoardCoordinates playerData={playerData} />

        <GameBoard
          gameData={gameData}
          playerData={playerData}
          gameStates={gameStates}
          selectionStates={selectionStates}
          setSelectionStates={setSelectionStates}
          chosePiece={chosePiece}
        />

        {/* promotion box */}
        {selectionStates.promotionCoor && !gameData.hasEnded && (
          <GameBoardPromotion
            playerData={playerData}
            gameStates={gameStates}
            selectionStates={selectionStates}
            setSelectionStates={setSelectionStates}
          />
        )}

        {/* confirm box */}
        {showConfirm && !gameData.hasEnded && (
          <GameBoardConfirm confirmAction={confirmAction} showConfirm={showConfirm} setShowConfirm={setShowConfirm} />
        )}

        {/* end game info*/}
        {winner && !searchIds && (
          <GameBoardWinner
            gameId={gameId}
            gameData={gameData}
            playerData={playerData}
            winner={winner}
            setSearchIds={setSearchIds}
            selectedTiming={selectedTiming}
            newGameId={newGameId}
          />
        )}

        {/* searching */}
        {winner && searchIds && <GameBoardSearching searchIds={searchIds} setSearchIds={setSearchIds} />}
      </div>
    </section>
  );
}

export default GameContent;
