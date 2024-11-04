import { useEffect, useReducer } from "react";
import classes from "./EngineGameContent.module.scss";
import { Guid } from "guid-typescript";
import { SMatrix } from "../../../shared/utils/types/commonTypes";
import { GetEngineGameDto, GetEngineGameMoveDto } from "../../../shared/utils/types/engineDtos";
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
import EngineGameCoordinates from "./engine-game-coordinates/EngineGameCoordinates";
import EngineGameBoard from "./engine-game-board/EngineGameBoard";
import EngineGamePromotion from "./engine-game-promotion/EngineGamePromotion";
import { engineController, getAuthorization } from "../../../shared/utils/services/ApiService";
import axios from "axios";
import { makeMove } from "../../../shared/utils/chess-game/makeMove";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";

type EngineGameContentProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  //
  getGame: () => Promise<void>;
};

function EngineGameContent({ gameId, gameData, getGame }: EngineGameContentProps) {
  ///

  const { showPopup } = usePopup();

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
      payload: gameData.player,
    });
  }, [gameData.player]);

  useEffect(() => {
    // set game data
    setGameStates({
      type: "SET_GAME_DATA",
      payload: gameData,
    });

    setTimeout(() => {
      updateStates();

      if (gameData.player.color !== gameData.turn % 2) {
        console.log("move by engine done");
        getEngineMove();
      }
    }, 100);
  }, [gameData]);
  //*/

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
  //*/

  const getEngineMove = async (): Promise<void> => {
    try {
      if (!gameId) return;

      const engineGameState: EngineGameStates = {
        gameId: gameId,
        gameData: gameData,
        playerData: null,
        matrix: gameStates.matrix.reverse(),
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
        engineController.getEngineGameMove(gameId),
        getAuthorization()
      );

      const [toX, toY] = response.data.newCoordinates.split(",");
      const engineToCoor: Coordinate = toCoor([parseInt(toX), parseInt(toY)]);

      const [fromX, fromY] = response.data.oldCoordinates.split(",");
      const engineFromCoor: Coordinate = toCoor([parseInt(fromX), parseInt(fromY)]);

      const enginePiece = engineGameState.matrix[parseInt(fromY) - 1][parseInt(fromX) - 1] as PieceOption;

      const engineSelection: SelectionStates = {
        isDragging: false, //not imp
        piece: enginePiece,
        target: null, //not imp
        coordinates: engineFromCoor,
        promotionCoor: response.data.promotedPiece !== null ? engineToCoor : null,
        availableFields: [], //not imp
      };

      await makeMove(TypeOfGame.engine, engineGameState, engineSelection, engineToCoor, response.data.promotedPiece);

      await getGame();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

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
        />

        {/* promotion box */}
        {selectionStates.promotionCoor && !gameData.hasEnded && (
          <EngineGamePromotion
            gameData={gameData}
            gameStates={gameStates}
            selectionStates={selectionStates}
            setSelectionStates={setSelectionStates}
            getEngineMove={getEngineMove}
          />
        )}

        {/* end game info*/}
        {/* {winner && (
          <EngineGameWinner
            gameData={gameData}
            winner={winner}
          />
        )} */}
      </div>
    </section>
  );
}

export default EngineGameContent;
