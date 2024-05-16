import { useEffect, useRef, useState } from "react";
import {
  pieceImageMap,
  piecePromotionMap,
  pieceTagMap,
} from "../../../shared/utils/enums/piecesMaps";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import classes from "./GameBoard.module.scss";
import {
  checkCoordinatesEquality,
  checkIfOwnPiece,
  checkIfPlayerTurn,
  fromPositionToListIndex,
  intToChar,
  onClearHighlights,
  onHighlightFile,
  performMoveAnimation,
} from "./utils/ExtraFunctions";
import { generateControlledAreas, checkChecks } from "./utils/ControlledAreas";
import MakeMove from "./utils/MakeMove";
import ShowTip from "./utils/ShowTip";
import { pieceColor } from "../../../shared/utils/enums/entitiesEnums";
import { CastleOptions } from "../../../shared/utils/types/commonTypes";
import XSvg from "../../../shared/svgs/XSvg";
import { generateRandomId } from "../../../shared/utils/functions/generateRandom";

type GameBoardProps = {
  gameId: string;
  gameData: GetGameDto;
  playerData: GetPlayerDto;
};

function GameBoard({ gameId, gameData, playerData }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<JSX.Element>(<></>);
  const [innerBoard, setInnerBoard] = useState(<></>);
  const [boardMatrix, setBaordMatrix] = useState<string[][]>([]);
  const [tipFields, setTipFields] = useState<number[][]>([]);

  // controlled areas
  const [whiteControlledAreas, setWhiteControlledAreas] = useState<number[][]>(
    []
  );
  const [blackControlledAreas, setBlackControlledAreas] = useState<number[][]>(
    []
  );
  // checked areas
  const [whiteCheckedAreas, setWhiteCheckedAreas] = useState<number[][]>([]);
  const [blackCheckedAreas, setBlackCheckedAreas] = useState<number[][]>([]);

  // selected piece
  const [selectedPiece, setSelectedPiece] = useState<string>("");
  const [selectedCoor, setselectedCoor] = useState<number[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<HTMLElement | null>(
    null
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // special moves options
  const [castleOptions, setCastleOptions] = useState<CastleOptions | null>(
    null
  );
  const [promotionCoordinates, setPromotionCoordinates] = useState<
    number[] | null
  >(null);

  // display done move
  const [oldCoordinates, setOldCoordinates] = useState<number[]>([]);
  const [newCoordinates, setNewCoordinates] = useState<number[]>([]);
  const [wasCapture, setWasCapture] = useState<boolean>(false);

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

      if (boardRef.current) {
        const fieldNodes = boardRef.current.querySelectorAll(
          `.${classes.field}`
        );

        const pieceParent = fieldNodes[
          fromPositionToListIndex(oldCoor)
        ] as HTMLElement;
        if (pieceParent) {
          const movedPiece = pieceParent.firstElementChild as HTMLElement;

          performMoveAnimation(
            boardRef.current,
            movedPiece,
            playerData,
            oldCoor,
            newCoor
          );
        }
      }
    }
  }, [gameData]);

  useEffect(() => {
    // set game matrix
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

    setTimeout(() => {
      const matrix = setMatrix(gameData.position);

      setBaordMatrix(matrix);

      // set controlled areas
      const [wControlled, bControlled] = generateControlledAreas(matrix);
      setWhiteControlledAreas(wControlled);
      setBlackControlledAreas(bControlled);

      // set checked areas
      const [wChecked, bChecked] = checkChecks(matrix);
      setWhiteCheckedAreas(wChecked);
      setBlackCheckedAreas(bChecked);

      // set castling optios
      setCastleOptions({
        cwkc: gameData.canWhiteKingCastle,
        cwsrc: gameData.canWhiteShortRookCastle,
        cwlrc: gameData.canWhiteLongRookCastle,
        cbkc: gameData.canBlackKingCastle,
        cbsrc: gameData.canBlackShortRookCastle,
        cblrc: gameData.canBlackLongRookCastle,
      });

      // update board when game changed (move was made)
      const [oBoard, iBoard] = mapFromGamePosition(gameData.position);
      setBoard(oBoard);
      setInnerBoard(iBoard);

      // clear selected piece and tips
      chosePiece("", []);
      setTipFields([]);
    }, 100);
  }, [gameData]);

  useEffect(() => {
    // update board when tips changed (user selected different piece)

    const [oBoard, iBoard] = mapFromGamePosition(gameData.position);
    setBoard(oBoard);
    setInnerBoard(iBoard);
  }, [tipFields]);

  // create field based on position
  const displayField = (
    fields: JSX.Element[],
    coor: number,
    char: string | null
  ): number => {
    const coordinates = [(coor % 8) + 1, 8 - Math.floor(coor / 8)];

    // to check if clicked on tip fields
    const isInTipFields = tipFields.some(
      (coordinate) => JSON.stringify(coordinate) === JSON.stringify(coordinates)
    );

    // to check if selected piece was selected again
    const sameCoor = checkCoordinatesEquality(coordinates, selectedCoor);

    // to check if kings are in check
    const isWhiteInCheck =
      char === pieceTagMap.white.king &&
      blackControlledAreas.some((area) =>
        checkCoordinatesEquality(area, coordinates)
      );
    const isBlackInCheck =
      char === pieceTagMap.black.king &&
      whiteControlledAreas.some((area) =>
        checkCoordinatesEquality(area, coordinates)
      );
    const isInCheck = isWhiteInCheck || isBlackInCheck;

    // to not display dragging piece
    const shouldDisplay = !(
      isDragging && checkCoordinatesEquality(selectedCoor, coordinates)
    );

    // to display done move
    const isOldFiled = checkCoordinatesEquality(coordinates, oldCoordinates);
    const isNewField = checkCoordinatesEquality(coordinates, newCoordinates);
    const showCapture = wasCapture && isNewField;

    // add field
    fields.push(
      <div
        key={`${coordinates[0]}-${coordinates[1]}`}
        className={`
          ${classes.field} ${isInTipFields ? classes.tip : ""}
          ${sameCoor ? classes.selected : ""}
          ${isInCheck ? classes.check : ""} 
          ${isOldFiled ? classes.old : ""} 
          ${isNewField ? classes.new : ""}
        `}
        onMouseDown={(event) => {
          if (event.button === 0) {
            onClearHighlights(classes.highlight);
          }
        }}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (char) setSelectedTarget(target);

          setIsDragging(false);
          onSelectField(char, coordinates, isInTipFields, sameCoor);
        }}
        onContextMenu={(event) => {
          onHighlightFile(event, classes.field, classes.highlight);
        }}
        onDragStart={() => {
          setIsDragging(true);
          onDragPiece(char, coordinates);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={() => {
          setIsDragging(false);
          onDropPiece(coordinates, isInTipFields, sameCoor);
        }}
      >
        {char && shouldDisplay && (
          <div
            className={classes.piece}
            draggable={checkIfOwnPiece(char, playerData)}
          >
            <img src={`/pieces/${pieceImageMap[char]}`} draggable={false} />
            {showCapture && <XSvg iconClass={classes.x} />}
          </div>
        )}
      </div>
    );

    coor++;
    return coor;
  };

  // create board from game position
  const mapFromGamePosition = (position: string): JSX.Element[] => {
    const fields: JSX.Element[] = [];
    const innerFields: JSX.Element[] = [];
    let fieldCoor: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      if (char == "/") {
        innerFields.push(<div key={`${i}`} className={classes.placeholder} />);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fieldCoor = displayField(fields, fieldCoor, null);
          innerFields.push(
            <div
              key={`filed-${generateRandomId(10)}`}
              className={classes["inner-field"]}
            />
          );
        }
      } else {
        fieldCoor = displayField(fields, fieldCoor, char);
        innerFields.push(
          <div
            key={`filed-${generateRandomId(10)}`}
            className={classes["inner-field"]}
          />
        );
      }
    }

    return [
      <div
        ref={boardRef}
        className={`${classes.board__content__grid} ${
          playerData.color === pieceColor.black
            ? classes["black-board"]
            : classes["white-board"]
        }`}
      >
        {fields}
      </div>,
      <div className={`${classes.board__content__inner}`}>{innerFields}</div>,
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
      ((selectedPiece === pieceTagMap.white.pawn && coordinates[1] === 8) ||
        (selectedPiece === pieceTagMap.black.pawn && coordinates[1] === 1))
    ) {
      setPromotionCoordinates(coordinates);
      return;
    }

    // make move if is in tips
    if (isInTipFields) {
      performMoveAnimation(
        boardRef.current,
        selectedTarget,
        playerData,
        selectedCoor,
        coordinates
      );

      setTimeout(() => {
        MakeMove.makeMove(
          gameId,
          boardMatrix,
          selectedPiece,
          selectedCoor,
          coordinates,
          gameData.enPassant,
          castleOptions
        );
      }, 100);

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

    // set chosen piece
    chosePiece(piece, coordinates);
  };

  const onDropPiece = (
    coordinates: number[],
    isInTipFields: boolean,
    samePiece: boolean
  ): void => {
    // unselect piece when back on same field
    if (samePiece) {
      chosePiece("", []);
      return;
    }

    if (
      isInTipFields &&
      ((selectedPiece === pieceTagMap.white.pawn && coordinates[1] === 8) ||
        (selectedPiece === pieceTagMap.black.pawn && coordinates[1] === 1))
    ) {
      setPromotionCoordinates(coordinates);
      return;
    }

    // if put on one of tip fields make move else clear piece
    if (isInTipFields) {
      MakeMove.makeMove(
        gameId,
        boardMatrix,
        selectedPiece,
        selectedCoor,
        coordinates,
        gameData.enPassant,
        castleOptions
      );
    } else {
      chosePiece("", []);
    }
  };

  // set selected piece and corresponding coordinates
  const chosePiece = (piece: string, coordinates: number[]) => {
    if (checkIfPlayerTurn(gameData.turn, playerData.color)) {
      setSelectedPiece(piece);
      setselectedCoor(coordinates);
    }
  };

  // set tip fields each time user choses different filed
  useEffect(() => {
    setTipFields(
      ShowTip.showTip(
        playerData,
        boardMatrix,
        whiteControlledAreas,
        blackControlledAreas,
        selectedCoor,
        selectedPiece,
        whiteCheckedAreas,
        blackCheckedAreas,
        gameData.enPassant,
        castleOptions
      )
    );
  }, [selectedCoor]);

  // promote pawn to choosen piece
  const onPerformPromotion = (promotedPiece: string) => {
    if (promotionCoordinates) {
      MakeMove.makeMove(
        gameId,
        boardMatrix,
        promotedPiece,
        selectedCoor,
        promotionCoordinates,
        gameData.enPassant,
        castleOptions
      );
    }

    setPromotionCoordinates(null);
  };

  return (
    <section className={classes["board-container"]}>
      <div className={classes.board}>
        <div
          className={`${classes.board__rows} ${
            playerData.color === pieceColor.black
              ? classes["black-indicators"]
              : classes["white-indicators"]
          }`}
        >
          {Array.from({ length: 8 }, (_, i) => i + 1)
            .reverse()
            .map((row, i) => (
              <div key={`row${i}`}>{row}</div>
            ))}
        </div>
        <div
          className={`${classes.board__columns} ${
            playerData.color === pieceColor.black
              ? classes["black-indicators"]
              : classes["white-indicators"]
          }`}
        >
          {Array.from({ length: 8 }, (_, i) => intToChar(i + 1)).map(
            (row, i) => (
              <div key={`col${i}`}>{row}</div>
            )
          )}
        </div>
        <div className={classes.board__content}>
          {innerBoard}
          {board}
        </div>
        {promotionCoordinates && (
          <div className={classes.board__promotion}>
            <div className={classes.board__promotion__pieces}>
              {playerData.color === pieceColor.white
                ? piecePromotionMap.white.map((p, i) => (
                    <div
                      key={`promotion-${i}`}
                      className={classes.piece}
                      onClick={() => {
                        onPerformPromotion(p);
                      }}
                    >
                      <img src={`/pieces/${pieceImageMap[p]}`} />
                    </div>
                  ))
                : piecePromotionMap.black.map((p, i) => (
                    <div
                      key={`promotion-${i}`}
                      className={classes.piece}
                      onClick={() => {
                        onPerformPromotion(p);
                      }}
                    >
                      <img src={`/pieces/${pieceImageMap[p]}`} />
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GameBoard;
