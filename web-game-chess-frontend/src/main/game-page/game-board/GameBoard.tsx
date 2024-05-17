import { useEffect, useRef, useState } from "react";
import {
  pieceImageMap,
  piecePromotionMap,
  pieceTagMap,
} from "../../../shared/utils/enums/piecesMaps";
import {
  EndGameDto,
  GetGameDto,
  GetPlayerDto,
} from "../../../shared/utils/types/gameDtos";
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
import { checkCheckMate } from "./utils/CheckCheckMate";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";

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
  const [innerBoard, setInnerBoard] = useState(<></>);
  const [boardMatrix, setBoardMatrix] = useState<string[][]>([]);
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
  const [capturedPiece, settCapturedPiece] = useState<string>("");

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

    const matrix = setMatrix(gameData.position);

    setBoardMatrix(matrix);

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

    // clear selected piece and tips (clear beform mapping board)
    chosePiece("", []);
    setTipFields([]);
  };

  useEffect(() => {
    // set game matrix

    // setTimeout(() => {
    // updateStates()
    // }, 100);

    updateStates();
  }, [gameData]);

  useEffect(() => {
    const endGame = async () => {
      if (!playerData.color) return;

      const loserPlayer: EndGameModel = {
        gameId: gameId,
        loserColor: playerData.color,
      };

      GameHubService.EndGame(loserPlayer);
    };

    const isCheckMate = checkCheckMate(
      playerData,
      boardMatrix,
      whiteControlledAreas,
      blackControlledAreas,
      whiteCheckedAreas,
      blackCheckedAreas,
      gameData.enPassant,
      castleOptions
    );

    if (isCheckMate) {
      endGame();
    }
  }, [boardMatrix]);

  useEffect(() => {
    // update board when tips changed (user selected different piece)

    const [oBoard, iBoard] = mapFromGamePosition(gameData.position);
    setBoard(oBoard);
    setInnerBoard(iBoard);
  }, [tipFields]);

  // create field based on position
  const displayField = (
    outerFields: JSX.Element[],
    innerFields: JSX.Element[],
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
          if (char) setSelectedTarget(target);

          setIsDragging(false);
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
      ((selectedPiece === pieceTagMap.white.pawn && coordinates[1] === 8) ||
        (selectedPiece === pieceTagMap.black.pawn && coordinates[1] === 1))
    ) {
      setPromotionCoordinates(coordinates);
      return;
    }

    // make move if is in tips
    if (isInTipFields) {
      performMoveAnimation(
        outerBoardRef.current,
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
      }, 0);

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
        {/* promotion box */}
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
        {/* end game info*/}
        {winner && (
          <div className={classes.board__end}>
            <div className={classes.board__end__content}>
              <h2
                className={`
                ${classes.title}
                ${
                  winner.winner === pieceColor.white
                    ? classes["white-winner"]
                    : ""
                }
                ${
                  winner.winner === pieceColor.black
                    ? classes["black-winner"]
                    : ""
                }
              `}
              >
                {winner.winner === pieceColor.white && <span>White</span>}
                {winner.winner === pieceColor.black && <span>Black</span>}
                <span> Wins</span>
                <span></span>
                <span></span>
              </h2>
              <div className={classes.players}>xxxx</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default GameBoard;
