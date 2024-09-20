import { Dispatch, useEffect, useRef, useState } from "react";
import classes from "./GameBoard.module.scss";
import { Coordinate, GameStates, PieceOption, SelectionStates } from "../../game-page-functions/types";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { GetGameDto, GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import { areCoorEqual, checkIfOwnPiece, posToIndex, toCoor } from "../../game-page-functions/general";
import { getPieceSideColor, pieceTagMap } from "../../../../shared/utils/objects/piecesNameMaps";
import { onClearHighlights, onHighlightFile, performMoveAnimation } from "../../game-page-functions/boardVisualization";
import { SelectionAction } from "../GameContentStates";
import { makeMove } from "../../game-page-functions/makeMove";
import { generateRandomId } from "../../../../shared/utils/functions/random";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { dangerColor } from "../../../../shared/utils/objects/colorMaps";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";

type GameBoardProps = {
  // current game data
  gameData: GetGameDto;
  //
  playerData: GetPlayerDto;
  //
  gameStates: GameStates;
  //
  selectionStates: SelectionStates;
  //
  setSelectionStates: Dispatch<SelectionAction>;
  //
  chosePiece: (piece: PieceOption, coordinates: Coordinate) => void;
};

function GameBoard({
  gameData,
  playerData,
  gameStates,
  selectionStates,
  setSelectionStates,
  chosePiece,
}: GameBoardProps) {
  ///

  // board parts refs
  const innerBoardRef = useRef<HTMLDivElement>(null);
  const outerBoardRef = useRef<HTMLDivElement>(null);

  // board component
  const [board, setBoard] = useState<JSX.Element>(<></>);
  const [innerBoard, setInnerBoard] = useState<JSX.Element>(<></>);

  // display done move
  const [oldCoordinates, setOldCoordinates] = useState<Coordinate>(null);
  const [newCoordinates, setNewCoordinates] = useState<Coordinate>(null);
  const [wasCapture, setWasCapture] = useState<boolean>(false);
  const [capturedPiece, settCapturedPiece] = useState<PieceOption>("");

  // display last done move and captures
  useEffect(() => {
    const lastMoveIndex = gameData.moves.length - 1;
    if (lastMoveIndex >= 0) {
      const lastMove = gameData.moves[lastMoveIndex];

      const oldCoor = toCoor(lastMove.oldCoor.split(",").map(Number));
      setOldCoordinates(oldCoor);

      const newCoor = toCoor(lastMove.newCoor.split(",").map(Number));
      setNewCoordinates(newCoor);

      const wasCap = lastMove.move[1] === "x";
      setWasCapture(wasCap);

      settCapturedPiece(lastMove.capturedPiece as PieceOption);

      // animation after opponents move
      if (
        innerBoardRef.current &&
        ((playerData.color === PieceColor.white && gameData.turn % 2 === 1) ||
          (playerData.color === PieceColor.black && gameData.turn % 2 === 0))
      ) {
        const fieldNodes = innerBoardRef.current.querySelectorAll(`.${classes.field}`);

        const pieceParent = fieldNodes[posToIndex(oldCoor)] as HTMLElement;
        if (pieceParent) {
          const movedPiece = pieceParent.firstElementChild as HTMLElement;

          performMoveAnimation(innerBoardRef.current, movedPiece, playerData, oldCoor, newCoor);
        }
      }
    }
  }, [gameData]);

  // create field based on position
  const displayField = (
    outerFields: JSX.Element[],
    innerFields: JSX.Element[],
    fieldNum: number,
    char: PieceOption | null
  ): number => {
    const coordinates = [(fieldNum % 8) + 1, 8 - Math.floor(fieldNum / 8)] as Coordinate;
    if (!coordinates) return fieldNum;

    // to check if clicked on tip fields
    const isInTipFields = selectionStates.availableFields.some((coordinate: Coordinate) =>
      areCoorEqual(coordinate, coordinates)
    );

    // to check if selected piece was selected again
    const sameCoor = areCoorEqual(coordinates, selectionStates.coordinates);

    // to check if kings are in check
    const isWhiteInCheck =
      char === pieceTagMap.white.king &&
      gameStates.controlledAreas.black.some((area: Coordinate) => areCoorEqual(area, coordinates));
    const isBlackInCheck =
      char === pieceTagMap.black.king &&
      gameStates.controlledAreas.white.some((area: Coordinate) => areCoorEqual(area, coordinates));
    const isInCheck = isWhiteInCheck || isBlackInCheck;

    // to not display dragging piece
    const shouldDisplay = !(selectionStates.isDragging && areCoorEqual(selectionStates.coordinates, coordinates));

    // to display done move
    const isOldFiled = areCoorEqual(coordinates, oldCoordinates);
    const isNewField = areCoorEqual(coordinates, newCoordinates);
    const showCapture = wasCapture && isNewField;

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
          onHighlightFile(innerBoardRef, coordinates, classes.highlight, classes.field);
        }}
        onDragStartCapture={() => {
          onDragPiece(char, coordinates);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
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
            {/* piece icon */}
            <IconCreator
              icons={defaultPiecesImages}
              iconName={char.toLowerCase() as PieceTag}
              iconClass={classes["piece-svg"]}
              color={getPieceSideColor(char as PieceTag)}
            />

            {/* capture icon */}
            {showCapture && (
              <div className={classes.capture}>
                <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes.x} color={dangerColor.mid} />
                <IconCreator
                  icons={defaultPiecesImages}
                  iconName={capturedPiece.toLowerCase() as PieceTag}
                  iconClass={classes["capture-svg"]}
                  color={getPieceSideColor(capturedPiece as PieceTag)}
                />
              </div>
            )}
          </div>
        )}
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

    fieldNum++;
    return fieldNum;
  };

  // create board from game position
  const mapFromGamePosition = (position: string): JSX.Element[] => {
    const outerFields: JSX.Element[] = [];
    const innerFields: JSX.Element[] = [];
    let fieldNum: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      // push placeholder when separator
      if (char == "/") {
        innerFields.push(<div key={`${i}`} className={classes.placeholder} />);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fieldNum = displayField(outerFields, innerFields, fieldNum, null);
        }
      } else {
        const pieceChar = char as PieceOption;
        fieldNum = displayField(outerFields, innerFields, fieldNum, pieceChar);
      }
    }

    return [
      <div
        ref={outerBoardRef}
        className={`
            ${classes.board__outer}
            ${playerData.color === PieceColor.black ? classes["black-board"] : classes["white-board"]}
          `}
      >
        {outerFields}
      </div>,
      <div
        ref={innerBoardRef}
        className={`
            ${classes.board__inner}
            ${playerData.color === PieceColor.black ? classes["black-board"] : classes["white-board"]}
          `}
      >
        {innerFields}
      </div>,
    ];
  };

  useEffect(() => {
    // update board when user selected different piece
    const [oBoard, iBoard] = mapFromGamePosition(gameData.position);
    setBoard(oBoard);
    setInnerBoard(iBoard);
  }, [selectionStates.availableFields, selectionStates.isDragging]);

  // click handler
  const onSelectField = (
    piece: PieceOption | null,
    coordinates: Coordinate,
    isInTipFields: boolean,
    samePiece: boolean
  ): void => {
    if (!coordinates) return;

    // unselect piece when clicked on same piece
    if (samePiece) {
      chosePiece("", null);
      return;
    }

    if (
      isInTipFields &&
      ((selectionStates.piece === pieceTagMap.white.pawn && coordinates[1] === 8) ||
        (selectionStates.piece === pieceTagMap.black.pawn && coordinates[1] === 1))
    ) {
      setSelectionStates({ type: "SET_PROMOTION_COOR", payload: coordinates });
      return;
    }

    // make move if is in tips
    if (isInTipFields) {
      performMoveAnimation(
        outerBoardRef.current,
        selectionStates.target,
        playerData,
        selectionStates.coordinates,
        coordinates
      );

      setTimeout(() => {
        makeMove(gameStates, selectionStates, coordinates, null);
      }, 100);

      return;
    }

    // if no tips, select piece
    if (piece && checkIfOwnPiece(piece, playerData)) {
      chosePiece(piece, coordinates);
      return;
    }

    // when clicked on empty field, while tips are set
    chosePiece("", null);
  };

  // drag & drop handlers
  const onDragPiece = (piece: PieceOption | null, coordinates: Coordinate): void => {
    // do not select if empty
    if (!piece) return;

    setSelectionStates({ type: "SET_IS_DRAGGING", payload: true });

    // set chosen piece
    chosePiece(piece, coordinates);
  };

  const onDropPiece = (coordinates: Coordinate, isInTipFields: boolean, samePiece: boolean): void => {
    if (!coordinates) return;

    setSelectionStates({ type: "SET_IS_DRAGGING", payload: false });

    // unselect piece when back on same field
    if (samePiece) {
      chosePiece("", null);
      return;
    }

    // add promotion coordinates when on last rank
    if (
      isInTipFields &&
      ((selectionStates.piece === pieceTagMap.white.pawn && coordinates[1] === 8) ||
        (selectionStates.piece === pieceTagMap.black.pawn && coordinates[1] === 1))
    ) {
      setSelectionStates({ type: "SET_PROMOTION_COOR", payload: coordinates });
      return;
    }

    // if put on one of tip fields make move else clear piece
    if (isInTipFields) {
      makeMove(gameStates, selectionStates, coordinates, null);
    } else {
      chosePiece("", null);
    }
  };

  return (
    <div className={classes.board}>
      {innerBoard}
      {board}
    </div>
  );
}

export default GameBoard;
