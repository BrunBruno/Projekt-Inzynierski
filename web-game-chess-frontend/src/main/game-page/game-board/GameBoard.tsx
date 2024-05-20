import { useEffect, useReducer, useRef, useState } from "react";
import {
  pieceImageMap,
  pieceTagMap,
} from "../../../shared/utils/enums/piecesMaps";
import {
  EndGameDto,
  GetGameDto,
  GetPlayerDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./GameBoard.module.scss";
import {
  areCoorEqual,
  checkIfOwnPiece,
  checkIfPlayerTurn,
} from "../../../shared/utils/functions/gameRelated";
import {
  generateControlledAreas,
  checkChecks,
} from "../../../shared/utils/chess-game/ControlledAreas";
import {
  endGameTypes,
  pieceColor,
} from "../../../shared/utils/enums/entitiesEnums";
import XSvg from "../../../shared/svgs/XSvg";
import { generateRandomId } from "../../../shared/utils/functions/generateRandom";
import { checkIfAnyMoveExists } from "../../../shared/utils/chess-game/CheckIfAnyMoveExists";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import GameBoardWinner from "./game-board-winner/GameBoardWinner";
import GameBoardPromotion from "./game-board-promotion/GameBoardPromotion";
import {
  gameInitialStates,
  gameStatesReducer,
  selectionInitialStates,
  selectionStatesReducer,
} from "./GameBoardStates";
import GameBoardCoordinates from "./game-board-coordinates/GameBoardCoordinates";
import FindMoves from "../../../shared/utils/chess-game/FindMoves";
import { makeMove } from "../../../shared/utils/chess-game/MakeMove";
import {
  onClearHighlights,
  onHighlightFile,
} from "../../../shared/utils/chess-game/BoardVisualization";

type GameBoardProps = {
  gameId: string;
  gameData: GetGameDto;
  playerData: GetPlayerDto;
  winner: EndGameDto | null;
};

function GameBoard({ gameId, gameData, playerData, winner }: GameBoardProps) {
  const innerBoardRef = useRef<HTMLDivElement>(null);
  const outerBoardRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<JSX.Element>(<></>);
  const [innerBoard, setInnerBoard] = useState<JSX.Element>(<></>);

  const [gameStates, setGameStates] = useReducer(
    gameStatesReducer,
    gameInitialStates
  );

  const [selectionStates, setSelectionStates] = useReducer(
    selectionStatesReducer,
    selectionInitialStates
  );

  // display done move
  const [oldCoordinates, setOldCoordinates] = useState<number[]>([]);
  const [newCoordinates, setNewCoordinates] = useState<number[]>([]);
  const [wasCapture, setWasCapture] = useState<boolean>(false);
  const [capturedPiece, settCapturedPiece] = useState<string>("");

  useEffect(() => {
    setGameStates({ type: "SET_GAME_ID", payload: gameId });
  }, [gameId]);

  // display last done move and captures
  useEffect(() => {
    const lastMoveIndex = gameData.moves.length - 1;
    if (lastMoveIndex >= 0) {
      const lastMove = gameData.moves[lastMoveIndex];

      const oldCoor = lastMove.oldCoor.split(",").map(Number);
      setOldCoordinates(oldCoor);

      const newCoor = lastMove.newCoor.split(",").map(Number);
      setNewCoordinates(newCoor);

      const wasCap = lastMove.move[1] === "x";
      setWasCapture(wasCap);

      settCapturedPiece(lastMove.capturedPiece);

      // animation after opponents move
      // if (
      //   boardRef.current &&
      //   ((playerData.color === pieceColor.white && gameData.turn % 2 === 1) ||
      //     (playerData.color === pieceColor.black && gameData.turn % 2 === 0))
      // ) {
      //   const fieldNodes = boardRef.current.querySelectorAll(
      //     `.${classes.field}`
      //   );

      //   const pieceParent = fieldNodes[
      //     fromPositionToListIndex(oldCoor)
      //   ] as HTMLElement;
      //   if (pieceParent) {
      //     const movedPiece = pieceParent.firstElementChild as HTMLElement;

      //     performMoveAnimation(
      //       boardRef.current,
      //       movedPiece,
      //       playerData,
      //       oldCoor,
      //       newCoor
      //     );
      //   }
      // }
    }
  }, [gameData]);

  const updateStates = () => {
    const setMatrix = (position: string): string[][] => {
      const matrix: string[][] = [[]];
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

    // clear selected piece and available fields (clear beform mapping board)
    setSelectionStates({
      type: "SET_AVAILABLE_FIELDS",
      payload: [],
    });

    chosePiece("", []);
  };

  useEffect(() => {
    // set player data
    setGameStates({
      type: "SET_PLAYER_DATA",
      payload: playerData,
    });
  }, [playerData]);

  useEffect(() => {
    // setTimeout(() => {
    //   updateStates();
    // }, 100);

    // set game data
    setGameStates({
      type: "SET_GAME_DATA",
      payload: gameData,
    });

    updateStates();
  }, [gameData]);

  useEffect(() => {
    const endGame = async (loserColor: number | null, endGameType: number) => {
      const loserPlayer: EndGameModel = {
        gameId: gameId,
        loserColor: loserColor,
        endGameType: endGameType,
      };

      GameHubService.EndGame(loserPlayer);
    };

    // end game if it has not been eneded yet
    if (!gameData.hasEnded && gameStates.matrix.length > 0) {
      const noMove = checkIfAnyMoveExists(gameStates, selectionStates);

      if (noMove) {
        if (
          playerData.color === pieceColor.white &&
          gameStates.checkAreas.black.length !== 0
        ) {
          // white has been check mated
          endGame(playerData.color, endGameTypes.checkMate);
        } else if (
          playerData.color === pieceColor.black &&
          gameStates.checkAreas.white.length !== 0
        ) {
          // black has been check mated
          endGame(playerData.color, endGameTypes.checkMate);
        } else {
          // draw
          endGame(null, endGameTypes.staleMate);
        }
      }
    }
  }, [gameStates.matrix]);

  useEffect(() => {
    // update board when user selected different piece
    const [oBoard, iBoard] = mapFromGamePosition(gameData.position);
    setBoard(oBoard);
    setInnerBoard(iBoard);
  }, [selectionStates.availableFelds]);

  // create field based on position
  const displayField = (
    outerFields: JSX.Element[],
    innerFields: JSX.Element[],
    coor: number,
    char: string | null
  ): number => {
    const coordinates = [(coor % 8) + 1, 8 - Math.floor(coor / 8)];

    // to check if clicked on tip fields
    const isInTipFields = selectionStates.availableFelds.some((coordinate) =>
      areCoorEqual(coordinate, coordinates)
    );

    // to check if selected piece was selected again
    const sameCoor = areCoorEqual(coordinates, selectionStates.coordinates);

    // to check if kings are in check
    const isWhiteInCheck =
      char === pieceTagMap.white.king &&
      gameStates.controlledAreas.black.some((area) =>
        areCoorEqual(area, coordinates)
      );
    const isBlackInCheck =
      char === pieceTagMap.black.king &&
      gameStates.controlledAreas.white.some((area) =>
        areCoorEqual(area, coordinates)
      );
    const isInCheck = isWhiteInCheck || isBlackInCheck;

    // to not display dragging piece
    const shouldDisplay = !(
      selectionStates.isDragging &&
      areCoorEqual(selectionStates.coordinates, coordinates)
    );

    // to display done move
    const isOldFiled = areCoorEqual(coordinates, oldCoordinates);
    const isNewField = areCoorEqual(coordinates, newCoordinates);
    const showCapture = wasCapture && isNewField;

    const bCon = gameStates.controlledAreas.black.some((coor) =>
      areCoorEqual(coor, coordinates)
    );
    const wCon = gameStates.controlledAreas.white.some((coor) =>
      areCoorEqual(coor, coordinates)
    );

    // add field
    outerFields.push(
      <div
        key={`${coordinates[0]}-${coordinates[1]}`}
        className={`
          ${classes.field}
          ${isInTipFields ? classes.tip : ""}
          ${sameCoor ? classes.selected : ""}
        `}
        onMouseDown={(event) => {
          if (event.button === 0) onClearHighlights(classes.highlight);
        }}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (char) setSelectionStates({ type: "SET_TARGET", payload: target });

          onSelectField(char, coordinates, isInTipFields, sameCoor);
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          onHighlightFile(
            innerBoardRef,
            coordinates,
            classes.highlight,
            classes.field
          );
        }}
        onDragStart={() => {
          onDragPiece(char, coordinates);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={() => {
          onDropPiece(coordinates, isInTipFields, sameCoor);
        }}
      >
        {char && shouldDisplay && (
          <div
            className={`
              ${classes.piece}
              ${checkIfOwnPiece(char, playerData) ? classes.own : ""}
            `}
            draggable={checkIfOwnPiece(char, playerData)}
          >
            <img
              src={`/pieces/${pieceImageMap[char]}`}
              draggable={false}
              alt={`piece-${char}`}
            />
            {showCapture && (
              <div className={classes.capture}>
                <XSvg iconClass={classes.x} />
                <img
                  src={`/pieces/${pieceImageMap[capturedPiece]}`}
                  alt={`captured-piece-${capturedPiece}`}
                />
              </div>
            )}
          </div>
        )}
        {/* {wCon && <p style={{ backgroundColor: "red" }}></p>}
        {bCon && <p style={{ backgroundColor: "blue" }}></p>}
        {wCon && bCon && <p style={{ backgroundColor: "orange" }}></p>} */}
      </div>
    );

    innerFields.push(
      <div
        key={`filed-${generateRandomId(10)}`}
        className={`
        ${classes.field}
        ${isInCheck ? classes.check : ""} 
        ${isOldFiled ? classes.old : ""} 
        ${isNewField ? classes.new : ""}
      `}
      />
    );

    coor++;
    return coor;
  };

  // create board from game position
  const mapFromGamePosition = (position: string): JSX.Element[] => {
    const outerFields: JSX.Element[] = [];
    const innerFields: JSX.Element[] = [];
    let fieldCoor: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      // push placeholder when separator
      if (char == "/") {
        innerFields.push(<div key={`${i}`} className={classes.placeholder} />);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fieldCoor = displayField(outerFields, innerFields, fieldCoor, null);
        }
      } else {
        fieldCoor = displayField(outerFields, innerFields, fieldCoor, char);
      }
    }

    return [
      <div
        ref={outerBoardRef}
        className={`
          ${classes.board__content__outer} 
          ${
            playerData.color === pieceColor.black
              ? classes["black-board"]
              : classes["white-board"]
          }
        `}
      >
        {outerFields}
      </div>,
      <div
        ref={innerBoardRef}
        className={`
          ${classes.board__content__inner} 
          ${
            playerData.color === pieceColor.black
              ? classes["black-board"]
              : classes["white-board"]
          }
        `}
      >
        {innerFields}
      </div>,
    ];
  };

  // click handler
  const onSelectField = (
    piece: string | null,
    coordinates: number[],
    isInTipFields: boolean,
    samePiece: boolean
  ): void => {
    // unselect piece when clicked on same piece

    if (samePiece) {
      chosePiece("", []);
      return;
    }

    if (
      isInTipFields &&
      ((selectionStates.piece === pieceTagMap.white.pawn &&
        coordinates[1] === 8) ||
        (selectionStates.piece === pieceTagMap.black.pawn &&
          coordinates[1] === 1))
    ) {
      setSelectionStates({ type: "SET_PROMOTION_COOR", payload: coordinates });
      return;
    }

    // make move if is in tips
    if (isInTipFields) {
      // performMoveAnimation(
      //   outerBoardRef.current,
      //   selectedTarget,
      //   playerData,
      //   selectedCoor,
      //   coordinates
      // );

      // setTimeout(() => {
      // makeMove(gameStates, selectionStates);
      // }, 100);
      makeMove(gameStates, selectionStates, coordinates, null);

      return;
    }

    // if no tips, select piece
    if (piece && checkIfOwnPiece(piece, playerData)) {
      chosePiece(piece, coordinates);
      return;
    }

    // when clicked on empty field, while tips are set
    chosePiece("", []);
  };

  // drag & drop handlers
  const onDragPiece = (piece: string | null, coordinates: number[]): void => {
    // do not select if empty
    if (!piece) {
      return;
    }

    setSelectionStates({ type: "SET_IS_DRAGGING", payload: true });

    // set chosen piece
    chosePiece(piece, coordinates);
  };

  const onDropPiece = (
    coordinates: number[],
    isInTipFields: boolean,
    samePiece: boolean
  ): void => {
    setSelectionStates({ type: "SET_IS_DRAGGING", payload: false });

    // unselect piece when back on same field
    if (samePiece) {
      chosePiece("", []);
      return;
    }

    // add promotion coordinates when on last rank
    if (
      isInTipFields &&
      ((selectionStates.piece === pieceTagMap.white.pawn &&
        coordinates[1] === 8) ||
        (selectionStates.piece === pieceTagMap.black.pawn &&
          coordinates[1] === 1))
    ) {
      setSelectionStates({ type: "SET_PROMOTION_COOR", payload: coordinates });
      return;
    }

    // if put on one of tip fields make move else clear piece
    if (isInTipFields) {
      makeMove(gameStates, selectionStates, coordinates);
    } else {
      chosePiece("", []);
    }
  };

  // set selected piece and corresponding coordinates
  const chosePiece = (piece: string, coordinates: number[]) => {
    if (checkIfPlayerTurn(gameData.turn, playerData.color)) {
      setSelectionStates({ type: "SET_PIECE", payload: piece });
      setSelectionStates({ type: "SET_COORDINATES", payload: coordinates });
    }
  };

  // set available fields each time user choses different filed
  useEffect(() => {
    const availableFields = FindMoves.find(gameStates, selectionStates);

    setSelectionStates({
      type: "SET_AVAILABLE_FIELDS",
      payload: availableFields,
    });
  }, [selectionStates.coordinates]);

  // promote pawn to choosen piece
  const onPerformPromotion = (promotedPiece: string): void => {
    if (selectionStates.promotionCoor) {
      makeMove(
        gameStates,
        selectionStates,
        selectionStates.promotionCoor,
        promotedPiece
      );
    }

    // setPromotionCoordinates(null);
    setSelectionStates({ type: "SET_PROMOTION_COOR", payload: [] });
  };

  return (
    <section className={classes["board-container"]}>
      <div className={classes.board}>
        <GameBoardCoordinates playerData={playerData} />

        <div className={classes.board__content}>
          {innerBoard}
          {board}
        </div>

        {/* promotion box */}
        {selectionStates.promotionCoor.length > 0 && (
          <GameBoardPromotion
            playerData={playerData}
            onPerformPromotion={onPerformPromotion}
          />
        )}

        {/* end game info*/}
        {winner && <GameBoardWinner gameData={gameData} winner={winner} />}
      </div>
    </section>
  );
}

export default GameBoard;
