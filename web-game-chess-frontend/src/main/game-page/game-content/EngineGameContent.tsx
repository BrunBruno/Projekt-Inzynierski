import { useEffect, useReducer } from "react";
import classes from "./GameContent.module.scss";
import { Guid } from "guid-typescript";
import { SMatrix, StateProp } from "../../../shared/utils/types/commonTypes";
import { EndEngineGameDto, GetEngineGameDto, GetEngineGameMoveDto } from "../../../shared/utils/types/engineGameDtos";
import {
  gameInitialStates,
  gameStatesReducer,
  selectionInitialStates,
  selectionStatesReducer,
} from "./EngineGameContentStates";
import { checkChecks, generateControlledAreas } from "../../../shared/utils/chess-game/controlledAreas";
import { checkIfPlayerTurn, toCoor } from "../../../shared/utils/chess-game/general";
import {
  Coordinate,
  EngineGameStates,
  PieceOption,
  SelectionStates,
  TypeOfGame,
} from "../../../shared/utils/chess-game/gameSates";
import findMoves from "../../../shared/utils/chess-game/findMoves";
import EngineGameCoordinates from "./game-coordinates/EngineGameCoordinates";
import EngineGameBoard from "./game-board/EngineGameBoard";
import EngineGamePromotion from "./game-promotion/EngineGamePromotion";
import { engineGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import axios from "axios";
import { makeMove } from "../../../shared/utils/chess-game/makeMove";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import { checkIfAnyMoveExists } from "../../../shared/utils/chess-game/checkIfAnyMoveExists";
import EngineGameWinner from "./game-winner/EngineGameWinner";
import EngineGameConfirm from "./game-confirm/EngineGameConfirm";
import { GameActionInterface, GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import GameEngine from "./game-engine/GameEngine";
import GameHistory from "./game-history/GameHistory";
import { MoveDto } from "../../../shared/utils/types/abstractDtosAndModels";
import GameSettings from "./game-settings/GameSettings";

type EngineGameContentProps = {
  // game data
  gameId: Guid;
  gameData: GetEngineGameDto;

  //
  getGame: () => Promise<void>;
  endGame: (loserColor: PieceColor | null) => Promise<void>;

  //
  winner: EndEngineGameDto | null;

  //
  historyPositionState: StateProp<MoveDto | null>;

  // to display/hide confirm window
  showConfirmState: StateProp<GameActionInterface | null>;
  // to perform action on confirm
  confirmAction: () => void;

  //
  displayedWindowState: StateProp<GameWindowInterface>;
};

function EngineGameContent({
  gameId,
  gameData,
  getGame,
  endGame,
  winner,
  historyPositionState,
  showConfirmState,
  confirmAction,
  displayedWindowState,
}: EngineGameContentProps) {
  ///

  const { showPopup } = usePopup();

  // states of game
  const [gameStates, setGameStates] = useReducer(gameStatesReducer, gameInitialStates);
  const [selectionStates, setSelectionStates] = useReducer(selectionStatesReducer, selectionInitialStates);

  useEffect(() => {
    setGameStates({ type: "SET_GAME_ID", payload: gameId });
  }, [gameId]);

  // to update states after each move
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
      payload: gameData.player,
    });
  }, [gameData.player]);

  useEffect(() => {
    // set game data
    setGameStates({
      type: "SET_GAME_DATA",
      payload: gameData,
    });

    setTimeout(async () => {
      updateStates();
    }, 100);
  }, [gameData]);

  // to check if game should end
  useEffect(() => {
    // end game if it has not been ended yet
    if (!gameData.hasEnded && gameStates.matrix.length > 0) {
      const noMove = checkIfAnyMoveExists(gameStates, selectionStates);

      if (noMove) {
        if (gameData.player.color === PieceColor.white && gameStates.checkAreas.black.length !== 0) {
          // white has been check mated
          endGame(gameData.player.color);
        } else if (gameData.player.color === PieceColor.black && gameStates.checkAreas.white.length !== 0) {
          // black has been check mated
          endGame(gameData.player.color);
        } else {
          // draw
          endGame(null);
        }
      }
    }
  }, [gameStates.matrix]);

  // set selected piece and corresponding coordinates
  const chosePiece = (piece: PieceOption, coordinates: Coordinate) => {
    if (checkIfPlayerTurn(gameData.turn, gameData.player.color)) {
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

  // make move by engine
  const getEngineMove = async (): Promise<void> => {
    try {
      if (!gameId) return;

      const tempEngineGameState: EngineGameStates = {
        gameId: gameId,
        gameData: gameData,
        playerData: null,
        matrix: gameStates.matrix,
        controlledAreas: {
          white: [],
          black: [],
        },
        checkAreas: {
          white: [],
          black: [],
        },
      };

      const response = await axios.get<GetEngineGameMoveDto>(
        engineGameController.getEngineGameMove(gameId),
        getAuthorization()
      );

      if (response.data.shouldEnd) {
        if (gameData.player.color === PieceColor.white && gameStates.checkAreas.white.length !== 0) {
          // black has been check mated
          endGame(PieceColor.black);
        } else if (gameData.player.color === PieceColor.black && gameStates.checkAreas.black.length !== 0) {
          // white has been check mated
          endGame(PieceColor.white);
        } else {
          // draw
          endGame(null);
        }

        return;
      }

      const [toX, toY] = response.data.newCoordinates.split(",");
      const engineToCoor: Coordinate = toCoor([parseInt(toX), parseInt(toY)]);

      const [fromX, fromY] = response.data.oldCoordinates.split(",");
      const engineFromCoor: Coordinate = toCoor([parseInt(fromX), parseInt(fromY)]);

      const enginePiece = tempEngineGameState.matrix[parseInt(fromY) - 1][parseInt(fromX) - 1] as PieceOption;

      const tempEngineSelection: SelectionStates = {
        isDragging: false, //not imp
        piece: enginePiece,
        target: null, //not imp
        coordinates: engineFromCoor,
        promotionCoor: response.data.promotedPiece !== null ? engineToCoor : null,
        availableFields: [], //not imp
      };

      await makeMove(
        TypeOfGame.engine,
        tempEngineGameState,
        tempEngineSelection,
        engineToCoor,
        response.data.promotedPiece
      );

      await getGame();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    // block premature move
    const count = gameStates.matrix.reduce((acc: number, subArray: string[]) => acc + subArray.length, 0);
    if (count !== 64) return;

    if (
      (gameData.player.color === PieceColor.white && gameData.turn % 2 === 1) ||
      (gameData.player.color === PieceColor.black && gameData.turn % 2 === 0)
    ) {
      getEngineMove();
    }
  }, [gameStates.matrix]);

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        {/* game board */}
        <EngineGameCoordinates gameData={gameData} />

        <EngineGameBoard
          gameData={gameData}
          gameStates={gameStates}
          selectionStates={selectionStates}
          setSelectionStates={setSelectionStates}
          chosePiece={chosePiece}
          getGame={getGame}
          setDisplayedWindow={displayedWindowState.set}
        />
        {/* --- */}

        {/* promotion box */}
        {displayedWindowState.get === GameWindowInterface.promotion &&
          selectionStates.promotionCoor &&
          !gameData.hasEnded && (
            <EngineGamePromotion
              gameData={gameData}
              gameStates={gameStates}
              selectionStates={selectionStates}
              setSelectionStates={setSelectionStates}
              getGame={getGame}
              setDisplayedWindow={displayedWindowState.set}
            />
          )}

        {/* confirm box */}
        {displayedWindowState.get === GameWindowInterface.confirm && showConfirmState && !gameData.hasEnded && (
          <EngineGameConfirm
            confirmAction={confirmAction}
            showConfirmState={showConfirmState}
            setDisplayedWindow={displayedWindowState.set}
          />
        )}

        {/* end game info*/}
        {displayedWindowState.get === GameWindowInterface.winner && winner && (
          <EngineGameWinner gameId={gameId} gameData={gameData} winner={winner} />
        )}

        {/* previous position show */}
        {displayedWindowState.get === GameWindowInterface.history && (
          <GameHistory
            gameData={gameData}
            playerData={gameData.player}
            historyPositionState={historyPositionState}
            setDisplayedWindow={displayedWindowState.set}
          />
        )}

        {/* settings */}
        {displayedWindowState.get === GameWindowInterface.settings && (
          <GameSettings gameData={gameData} setDisplayedWindow={displayedWindowState.set} />
        )}

        {/* engine selection */}
        {displayedWindowState.get === GameWindowInterface.engine && (
          <GameEngine gameId={gameId} setDisplayedWindow={displayedWindowState.set} />
        )}
      </div>
    </section>
  );
}

export default EngineGameContent;
