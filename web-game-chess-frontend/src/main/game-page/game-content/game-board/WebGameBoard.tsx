import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import classes from "./GameBoard.module.scss";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { GetWebGameDto, GetWebGamePlayerDto } from "../../../../shared/utils/types/webGameDtos";
import { getPieceSideColor, pieceTagMap } from "../../../../shared/utils/objects/piecesNameMaps";
import { SelectionAction } from "../WebGameContentStates";
import { generateRandomId } from "../../../../shared/utils/functions/random";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { dangerColor } from "../../../../shared/utils/objects/colorMaps";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import {
  Coordinate,
  PieceOption,
  SelectionStates,
  TypeOfGame,
  WebGameStates,
} from "../../../../shared/utils/chess-game/gameSates";
import { areCoorEqual, checkIfOwnPiece, toCoor } from "../../../../shared/utils/chess-game/general";
import {
  changeBoardByUserSettings,
  changePiecesByUserSettings,
  onClearHighlights,
  onHighlightFile,
  performMoveAnimation,
  playMoveSound,
} from "../../../../shared/utils/chess-game/boardVisualization";
import { makeMove } from "../../../../shared/utils/chess-game/makeMove";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";

type WebGameBoardProps = {
  // current game and player data
  gameData: GetWebGameDto;
  playerData: GetWebGamePlayerDto;
  // game states
  gameStates: WebGameStates;
  // user selection states and setters
  selectionStates: SelectionStates;
  setSelectionStates: Dispatch<SelectionAction>;
  // to selection piece
  chosePiece: (piece: PieceOption, coordinates: Coordinate) => void;
  // for changing displayed window
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGameBoard({
  gameData,
  playerData,
  gameStates,
  selectionStates,
  setSelectionStates,
  chosePiece,
  setDisplayedWindow,
}: WebGameBoardProps) {
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

      const wasCapture = lastMove.move[1] === "x";
      setWasCapture(wasCapture);

      settCapturedPiece(lastMove.capturedPiece as PieceOption);

      // animation after opponents move
      if (
        outerBoardRef.current &&
        oldCoor &&
        ((playerData.color === PieceColor.white && gameData.turn % 2 === 0) ||
          (playerData.color === PieceColor.black && gameData.turn % 2 === 1))
      ) {
        const pieceParent = document.getElementById(`field-${oldCoor[0]}-${oldCoor[1]}`);

        if (pieceParent) {
          const movedPiece = pieceParent.firstElementChild as HTMLElement;

          performMoveAnimation(outerBoardRef.current, movedPiece, playerData, oldCoor, newCoor);
        }
      }

      const wasCheck = lastMove.fenMove[lastMove.fenMove.length - 1] === "#";
      playMoveSound(wasCapture, wasCheck);
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

    let isEnPassCoor: boolean = false;
    if (gameData.enPassant) {
      const [enX, enY] = gameData.enPassant.split(",");
      const [eXCoor, eYCoor] = [parseInt(enX), parseInt(enY)];
      isEnPassCoor = areCoorEqual(toCoor([eXCoor, eYCoor]), coordinates);
    }

    // add field
    outerFields.push(
      <div
        id={`field-${coordinates[0]}-${coordinates[1]}`}
        key={`${coordinates[0]}-${coordinates[1]}`}
        className={`
          ${classes.field}
          ${isInTipFields ? classes.tip : ""}
          ${isEnPassCoor ? classes["en-capture"] : ""}
          ${sameCoor ? classes.selected : ""}
        `}
        onMouseDown={(event) => {
          if (event.button === 0) onClearHighlights(classes.highlight);
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          onHighlightFile(innerBoardRef, coordinates, classes.highlight, classes.field);
        }}
      >
        {char && shouldDisplay ? (
          <div
            className={`
              ${classes.piece}
              ${checkIfOwnPiece(char, playerData) ? classes.own : ""}
            `}
            draggable={checkIfOwnPiece(char, playerData)}
            style={{ transform: "none" }} // clear
            onClick={(event) => {
              const target = event.target as HTMLDivElement;
              if (target) setSelectionStates({ type: "SET_TARGET", payload: target });

              onSelectField(char, coordinates, isInTipFields, sameCoor);
            }}
            onDragStartCapture={() => {
              onDragPiece(char, coordinates);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              onDropPiece(coordinates, isInTipFields, sameCoor);
            }}
            onDragEndCapture={() => {
              clearDrag();
            }}
          >
            {/* piece icon */}
            <IconCreator
              icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
              iconName={char.toLowerCase() as PieceTag}
              iconClass={classes["piece-svg"]}
              color={getPieceSideColor(char as PieceTag)}
              active={true}
            />

            {/* capture icon */}
            {showCapture && (
              <div className={classes.capture}>
                <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes.x} color={dangerColor.mid} />
                <IconCreator
                  icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
                  iconName={capturedPiece.toLowerCase() as PieceTag}
                  iconClass={classes["capture-svg"]}
                  color={getPieceSideColor(capturedPiece as PieceTag)}
                  active={true}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            className={classes.empty}
            onClick={() => {
              onSelectField(char, coordinates, isInTipFields, sameCoor);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              onDropPiece(coordinates, isInTipFields, sameCoor);
            }}
            onDragEndCapture={() => {
              clearDrag();
            }}
          ></div>
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
          ${changeBoardByUserSettings(gameData.gameSettings.appearanceOfBoard, classes)}
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
      setDisplayedWindow(GameWindowInterface.promotion);
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

      setTimeout(async () => {
        await makeMove(TypeOfGame.web, gameStates, selectionStates, coordinates, null);
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

  const onDropPiece = async (coordinates: Coordinate, isInTipFields: boolean, samePiece: boolean): Promise<void> => {
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
      setDisplayedWindow(GameWindowInterface.promotion);
      return;
    }

    // if put on one of tip fields make move else clear piece
    if (isInTipFields) {
      await makeMove(TypeOfGame.web, gameStates, selectionStates, coordinates, null);
    } else {
      chosePiece("", null);
    }
  };

  const clearDrag = () => {
    setSelectionStates({ type: "SET_IS_DRAGGING", payload: false });
    chosePiece("", null);
  };

  return (
    <div className={classes.board}>
      {innerBoard}
      {board}
    </div>
  );
}

export default WebGameBoard;
