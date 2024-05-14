import { useEffect, useState } from "react";
import { pieceColor } from "../../../shared/utils/enums/pieceColorEnum";
import {
  pieceImageMap,
  pieceTagMap,
} from "../../../shared/utils/enums/piecesMaps";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import classes from "./GameBoard.module.scss";
import { showTip } from "./GameBoardShowTip";
import {
  checkCoordinatesEquality,
  checkIfPlayerTurn,
} from "./GameBoardFunctions";
import { makeMove } from "./GameBoardMakeMove";
import {
  generateControlledAreas,
  checkChecks,
} from "./GameBoardControlledAreas";

type GameBoardProps = {
  gameId: string;
  gameData: GetGameDto;
  playerData: GetPlayerDto;
  connection: signalR.HubConnection | null;
};

function GameBoard({
  gameId,
  gameData,
  playerData,
  connection,
}: GameBoardProps) {
  const [board, setBoard] = useState<JSX.Element>(<></>);
  const [boardMatrix, setBaordMatrix] = useState<string[][]>([]);
  const [tipFields, setTipFields] = useState<number[][]>([]);

  const [whiteControlledAreas, setWhiteControlledAreas] = useState<number[][]>(
    []
  );
  const [blackControlledAreas, setBlackControlledAreas] = useState<number[][]>(
    []
  );
  const [whiteCheckedAreas, setWhiteCheckedAreas] = useState<number[][]>([]);
  const [blackCheckedAreas, setBlackCheckedAreas] = useState<number[][]>([]);

  const [selectedPiece, setSelectedPiece] = useState<string>("");
  const [selectedCoor, setselectedCoor] = useState<number[]>([]);

  // set game matrix
  useEffect(() => {
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

    setBaordMatrix(matrix);

    const [
      whiteControlledAreas,
      blackControlledAreas,
    ] = generateControlledAreas(matrix);

    setWhiteControlledAreas(whiteControlledAreas);
    setBlackControlledAreas(blackControlledAreas);

    const [whiteCheckAreas, blackCheckAreas] = checkChecks(matrix);

    setWhiteCheckedAreas(whiteCheckAreas);
    setBlackCheckedAreas(blackCheckAreas);
  }, [gameData]);

  // create field based on position
  const displayField = (
    fields: JSX.Element[],
    fieldCoor: number,
    char: string | null
  ): number => {
    const coordinates = [(fieldCoor % 8) + 1, 8 - Math.floor(fieldCoor / 8)];

    const isInTipFields = tipFields.some(
      (coordinate) => JSON.stringify(coordinate) === JSON.stringify(coordinates)
    );

    const isInWhite = whiteControlledAreas.some(
      (coordinate) => JSON.stringify(coordinate) === JSON.stringify(coordinates)
    );
    const isInBlack = blackControlledAreas.some(
      (coordinate) => JSON.stringify(coordinate) === JSON.stringify(coordinates)
    );

    const style = {
      backgroundColor:
        isInWhite && isInBlack
          ? "rgba(0, 0, 0, 0.5)"
          : isInWhite
          ? "rgba(0, 255, 255, 0.5)"
          : isInBlack
          ? "rgba(255, 0, 0, 0.5)"
          : "",
    };

    let isWhiteInCheck = false;
    if (char === pieceTagMap.white.king) {
      isWhiteInCheck = blackControlledAreas.some(
        (area) => area[0] === coordinates[0] && area[1] === coordinates[1]
      );
    }

    let isBlackInCheck = false;
    if (char === pieceTagMap.black.king) {
      isBlackInCheck = whiteControlledAreas.some(
        (area) => area[0] === coordinates[0] && area[1] === coordinates[1]
      );
    }

    const sameCoor = checkCoordinatesEquality(coordinates, selectedCoor);
    const isInCheck = isWhiteInCheck || isBlackInCheck;

    fields.push(
      <div
        key={`${coordinates[0]}-${coordinates[1]}`}
        className={`${classes.field} ${isInTipFields ? classes.tip : ""} ${
          sameCoor ? classes.selected : ""
        } ${isInCheck ? classes.check : ""}`}
        onClick={() => {
          onSelectField(char, coordinates, isInTipFields);
        }}
      >
        {char && (
          <div className={classes.piece}>
            <img src={`/pieces/${pieceImageMap[char]}`} draggable={false} />
          </div>
        )}
        <p style={style} />
      </div>
    );

    fieldCoor++;
    return fieldCoor;
  };

  // create board from game position
  const mapFromGamePosition = (position: string): JSX.Element => {
    const fields: JSX.Element[] = [];
    let fieldCoor: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      if (char == "/") {
        fields.push(<div key={`${i}`} className={classes.placeholder} />);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fieldCoor = displayField(fields, fieldCoor, null);
        }
      } else {
        fieldCoor = displayField(fields, fieldCoor, char);
      }
    }

    return (
      <div
        className={`${classes.board__grid} ${
          playerData.color === pieceColor.black
            ? classes["black-board"]
            : classes["white-board"]
        }`}
      >
        {fields}
      </div>
    );
  };

  useEffect(() => {
    // update board when tips changed (user selected different piece)
    setBoard(mapFromGamePosition(gameData.position));
  }, [tipFields]);

  useEffect(() => {
    // update board when game changed (move was made)
    setBoard(mapFromGamePosition(gameData.position));

    // clear selected piece and tips
    chosePiece("", []);
    setTipFields([]);
  }, [gameData]);

  const onSelectField = (
    piece: string | null,
    coordinates: number[],
    isInTipFields: boolean
  ) => {
    if (piece) {
      const colorIndex = playerData.color === 0 ? "white" : "black";
      const piecesForColor = pieceTagMap[colorIndex];

      const isOwnPiece = Object.values(piecesForColor).includes(piece);

      if (isOwnPiece) {
        if (checkCoordinatesEquality(coordinates, selectedCoor)) {
          chosePiece("", []);
        } else {
          chosePiece(piece, coordinates);
        }
      } else {
        if (isInTipFields) {
          // make move
          makeMove(
            connection,
            gameId,
            boardMatrix,
            selectedPiece,
            selectedCoor,
            coordinates
          );
        } else {
          chosePiece("", []);
        }
      }
    } else {
      if (isInTipFields) {
        // make move
        makeMove(
          connection,
          gameId,
          boardMatrix,
          selectedPiece,
          selectedCoor,
          coordinates
        );
      } else {
        chosePiece("", []);
      }
    }
  };

  const chosePiece = (piece: string, coordinates: number[]) => {
    if (checkIfPlayerTurn(gameData.turn, playerData.color)) {
      setSelectedPiece(piece);
      setselectedCoor(coordinates);
    }
  };

  useEffect(() => {
    // set tip fields each time user choses different filed
    setTipFields(
      showTip(
        playerData,
        boardMatrix,
        whiteControlledAreas,
        blackControlledAreas,
        selectedCoor,
        selectedPiece,
        whiteCheckedAreas,
        blackCheckedAreas
      )
    );
  }, [selectedCoor]);

  return (
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
        {Array.from({ length: 8 }, (_, i) => String.fromCharCode(65 + i)).map(
          (row, i) => (
            <div key={`col${i}`}>{row}</div>
          )
        )}
      </div>
      {board}

      {playerData.color}
    </div>
  );
}

export default GameBoard;
