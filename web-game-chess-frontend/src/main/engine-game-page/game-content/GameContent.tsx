import { useEffect, useReducer } from "react";
import classes from "./GameContent.module.scss";
import GameBoardPromotion from "./game-board-promotion/GameBoardPromotion";
import {
  gameInitialStates,
  gameStatesReducer,
  selectionInitialStates,
  selectionStatesReducer,
} from "./GameContentStates";
import GameBoardCoordinates from "./game-board-coordinates/GameBoardCoordinates";
import { Guid } from "guid-typescript";
import GameBoard from "./game-board/GameBoard";
import { Coordinate, PieceOption } from "../game-page-functions/types";
import { checkIfPlayerTurn } from "../game-page-functions/general";
import { checkChecks, generateControlledAreas } from "../game-page-functions/controlledAreas";
import findMoves from "../game-page-functions/findMoves";
import { SMatrix } from "../../../shared/utils/types/commonTypes";
import { GetEngineGameDto } from "../../../shared/utils/types/engineDtos";

type GameContentProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
};

function GameContent({ gameId, gameData }: GameContentProps) {
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

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        {/* game board */}
        <GameBoardCoordinates gameData={gameData} />

        <GameBoard
          gameData={gameData}
          gameStates={gameStates}
          selectionStates={selectionStates}
          setSelectionStates={setSelectionStates}
          chosePiece={chosePiece}
        />

        {/* promotion box */}
        {selectionStates.promotionCoor && !gameData.hasEnded && (
          <GameBoardPromotion
            gameData={gameData}
            gameStates={gameStates}
            selectionStates={selectionStates}
            setSelectionStates={setSelectionStates}
          />
        )}

        {/* end game info*/}
        {/* {winner && (
          <GameBoardWinner
            gameId={gameId}
            gameData={gameData}
          />
        )} */}
      </div>
    </section>
  );
}

export default GameContent;
