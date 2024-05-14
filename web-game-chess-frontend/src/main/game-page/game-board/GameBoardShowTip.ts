import { pieceColor } from "../../../shared/utils/enums/pieceColorEnum";
import { pieceTagMap } from "../../../shared/utils/enums/piecesMaps";
import { movementMap } from "../../../shared/utils/enums/piecesMovementMap";
import { GetPlayerDto } from "../../../shared/utils/types/gameDtos";

let playerColor: { [key: string]: string } = {};
let boardMatrix: string[][] = [];

// generate areas when pieces can move to
export const showTip = (
  player: GetPlayerDto,
  matrix: string[][],
  whiteAreas: number[][],
  blackAreas: number[][],
  field: number[],
  pieceTag: string,
  whiteChecks: number[][],
  blackChecks: number[][]
): number[][] => {
  boardMatrix = matrix;

  let tipFields: number[][] = [field];
  const color: number | null = player.color;
  const xCoor: number = field[0];
  const yCoor: number = field[1];

  let foundTips: number[][] = [];

  if (color === pieceColor.white) {
    playerColor = pieceTagMap.white;
  }
  if (color === pieceColor.black) {
    playerColor = pieceTagMap.black;
  }

  let directionVector: number[][] | null = null;
  const [isPinned, direction] = checkPin(xCoor, yCoor, pieceTag);
  if (isPinned) {
    directionVector = getDirectionVectors(direction);
  }

  switch (pieceTag) {
    case pieceTagMap.white.pawn:
    case pieceTagMap.black.pawn:
      foundTips = checkPawnMove(xCoor, yCoor, directionVector);
      break;
    case pieceTagMap.white.knight:
    case pieceTagMap.black.knight:
      if (!isPinned) {
        foundTips = checkKnightMoves(xCoor, yCoor);
      }
      break;
    case pieceTagMap.white.bishop:
    case pieceTagMap.black.bishop:
      foundTips = checkPiecesMoves(
        xCoor,
        yCoor,
        movementMap.bishopMoves,
        directionVector
      );
      break;
    case pieceTagMap.white.rook:
    case pieceTagMap.black.rook:
      foundTips = checkPiecesMoves(
        xCoor,
        yCoor,
        movementMap.rookMoves,
        directionVector
      );
      break;
    case pieceTagMap.white.queen:
    case pieceTagMap.black.queen:
      foundTips = checkPiecesMoves(
        xCoor,
        yCoor,
        movementMap.queenMoves,
        directionVector
      );
      break;
    case pieceTagMap.white.king:
      foundTips = checkKingMoves(xCoor, yCoor, blackAreas);
      break;
    case pieceTagMap.black.king:
      foundTips = checkKingMoves(xCoor, yCoor, whiteAreas);
      break;
    default:
      break;
  }

  tipFields.push(...foundTips);

  // if check exist then limit pieces moves to stop check
  if (
    pieceTag !== pieceTagMap.white.king &&
    pieceTag !== pieceTagMap.black.king
  ) {
    if (color === pieceColor.white && blackChecks.length > 0) {
      tipFields = tipFields.filter((tip) =>
        blackChecks.some((check) => check[0] === tip[0] && check[1] === tip[1])
      );
    }
    if (color === pieceColor.black && whiteChecks.length > 0) {
      tipFields = tipFields.filter((tip) =>
        whiteChecks.some((check) => check[0] === tip[0] && check[1] === tip[1])
      );
    }
  }

  return tipFields;
};

// isValid | isEmpty
const isValidAndIsEmptyField = (x: number, y: number): boolean[] => {
  let isValid: boolean = false;
  let isEmpty: boolean = false;

  if (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
    const piece = boardMatrix[y - 1][x - 1];
    if (piece === "") {
      isEmpty = true;
    }

    const isOwnPiece = Object.values(playerColor).includes(piece);
    isValid = !isOwnPiece;
  }

  return [isValid, isEmpty];
};

const checkPawnMove = (
  xCoor: number,
  yCoor: number,
  directions: number[][] | null
): number[][] => {
  const tipFields: number[][] = [];

  let dir: number | null = null;
  if (directions !== null) {
    dir = directions[0][0] * directions[0][1];
  }

  if (playerColor === pieceTagMap.white) {
    let firstIsValid: boolean = false;

    let x: number = xCoor;
    let y: number = yCoor + 1;
    let [isValid, isEmpy]: boolean[] = isValidAndIsEmptyField(x, y);

    if (isValid && isEmpy && (dir === null || dir === 0)) {
      firstIsValid = true;
      tipFields.push([x, y]);
    }

    x = xCoor + 1;
    y = yCoor + 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid && !isEmpy && (dir === null || dir > 0)) {
      tipFields.push([x, y]);
    }

    x = xCoor - 1;
    y = yCoor + 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid && !isEmpy && (dir === null || dir < 0)) {
      tipFields.push([x, y]);
    }

    if (yCoor === 2 && firstIsValid) {
      x = xCoor;
      y = yCoor + 2;
      [isValid, isEmpy] = isValidAndIsEmptyField(x, y);

      if (isValid && isEmpy && (dir === null || dir === 0)) {
        tipFields.push([x, y]);
      }
    }
  }

  if (playerColor === pieceTagMap.black) {
    let firstIsValid: boolean = false;

    let x: number = xCoor;
    let y: number = yCoor - 1;
    let [isValid, isEmpy]: boolean[] = isValidAndIsEmptyField(x, y);

    if (isValid && isEmpy && (dir === null || dir === 0)) {
      firstIsValid = true;
      tipFields.push([x, y]);
    }

    x = xCoor + 1;
    y = yCoor - 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid && !isEmpy && (dir === null || dir < 0)) {
      tipFields.push([x, y]);
    }

    x = xCoor - 1;
    y = yCoor - 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid && !isEmpy && (dir === null || dir > 0)) {
      tipFields.push([x, y]);
    }

    if (yCoor === 7 && firstIsValid) {
      x = xCoor;
      y = yCoor - 2;
      [isValid, isEmpy] = isValidAndIsEmptyField(x, y);

      if (isValid && isEmpy && (dir === null || dir === 0)) {
        tipFields.push([x, y]);
      }
    }
  }

  return tipFields;
};

const checkKnightMoves = (xCoor: number, yCoor: number): number[][] => {
  const tipFields: number[][] = [];

  for (const [dx, dy] of movementMap.knightMoves) {
    const x = xCoor + dx;
    const y = yCoor + dy;

    const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      tipFields.push([x, y]);
    }
  }

  return tipFields;
};

const checkPiecesMoves = (
  xCoor: number,
  yCoor: number,
  pieceMoves: number[][],
  directions: number[][] | null
): number[][] => {
  let moves: number[][] = [];
  if (directions !== null) {
    moves = directions;
  } else {
    moves = pieceMoves;
  }

  const tipFields: number[][] = [];

  for (const [dx, dy] of moves) {
    let x = xCoor + dx;
    let y = yCoor + dy;

    let [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    while (isValid) {
      tipFields.push([x, y]);

      if (!isEmpty) {
        break;
      }

      x += dx;
      y += dy;

      [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    }
  }

  return tipFields;
};

const checkKingMoves = (
  xCoor: number,
  yCoor: number,
  areas: number[][]
): number[][] => {
  const tipFields: number[][] = [];

  for (const [dx, dy] of movementMap.kingMoves) {
    const x = xCoor + dx;
    const y = yCoor + dy;

    const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);

    const isInArea = areas.some((coord) => coord[0] === x && coord[1] === y);

    if (isValid && !isInArea) {
      tipFields.push([x, y]);
    }
  }

  return tipFields;
};

const directions = {
  ver: "ver",
  hor: "hor",
  btd: "btd",
  tbd: "tbd",
};

const getDirectionVectors = (direction: string): number[][] | null => {
  const directionMap = {
    hor: [
      [1, 0],
      [-1, 0],
    ],
    ver: [
      [0, 1],
      [0, -1],
    ],
    btd: [
      [1, 1],
      [-1, -1],
    ],
    tbd: [
      [1, -1],
      [-1, 1],
    ],
  };
  switch (direction) {
    case directions.ver:
      return directionMap.ver;
    case directions.hor:
      return directionMap.hor;
    case directions.btd:
      return directionMap.btd;
    case directions.tbd:
      return directionMap.tbd;
    default:
      return null;
  }
};

const checkDirection = (x: number, y: number) => {
  if (x * y < 0) {
    return directions.tbd;
  } else if (x * y > 0) {
    return directions.btd;
  } else if (x === 0) {
    return directions.ver;
  } else if (y === 0) {
    return directions.hor;
  }
};

// check if piece is pinned (return isPinned, direction of pin)
const checkPin = (
  xCoor: number,
  yCoor: number,
  pieceTag: string
): [boolean, string] => {
  if (
    pieceTag === pieceTagMap.white.king ||
    pieceTag === pieceTagMap.black.king
  ) {
    return [false, ""];
  }

  const foundPieces = [];

  for (const [dx, dy] of movementMap.bishopMoves) {
    let x = xCoor + dx;
    let y = yCoor + dy;

    while (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
      const piece = boardMatrix[y - 1][x - 1];
      if (piece !== "") {
        const dir = checkDirection(dx, dy);
        foundPieces.push([piece, dir]);
        break;
      }

      x += dx;
      y += dy;
    }
  }
  for (const [dx, dy] of movementMap.rookMoves) {
    let x = xCoor + dx;
    let y = yCoor + dy;

    while (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
      const piece = boardMatrix[y - 1][x - 1];

      if (piece !== "") {
        const dir = checkDirection(dx, dy);
        foundPieces.push([piece, dir]);
        break;
      }

      x += dx;
      y += dy;
    }
  }

  let isPinning: boolean = false;
  let direction: string = "";

  if (playerColor === pieceTagMap.white) {
    const whiteKing = foundPieces.find(
      (piece) => piece[0] === pieceTagMap.white.king
    );

    if (whiteKing) {
      const whiteKingDir = whiteKing[1];

      const pinningPiece = foundPieces.find(
        (piece) =>
          piece[1] === whiteKingDir && piece[0] !== pieceTagMap.white.king
      );

      if (pinningPiece) {
        if (
          (whiteKingDir === directions.btd ||
            whiteKingDir === directions.tbd) &&
          (pinningPiece[0] === pieceTagMap.black.bishop ||
            pinningPiece[0] === pieceTagMap.black.queen)
        ) {
          direction = whiteKingDir;
          isPinning = true;
        }
        if (
          (whiteKingDir === directions.hor ||
            whiteKingDir === directions.ver) &&
          (pinningPiece[0] === pieceTagMap.black.rook ||
            pinningPiece[0] === pieceTagMap.black.queen)
        ) {
          direction = whiteKingDir;
          isPinning = true;
        }
      }
    }
  }
  if (playerColor === pieceTagMap.black) {
    const blackKing = foundPieces.find(
      (piece) => piece[0] === pieceTagMap.black.king
    );

    if (blackKing) {
      const blackKingDir = blackKing[1];

      const pinningPiece = foundPieces.find(
        (piece) =>
          piece[1] === blackKingDir && piece[0] !== pieceTagMap.black.king
      );

      if (pinningPiece) {
        if (
          (blackKingDir === directions.btd ||
            blackKingDir === directions.tbd) &&
          (pinningPiece[0] === pieceTagMap.white.bishop ||
            pinningPiece[0] === pieceTagMap.white.queen)
        ) {
          direction = blackKingDir;
          isPinning = true;
        }
        if (
          (blackKingDir === directions.hor ||
            blackKingDir === directions.ver) &&
          (pinningPiece[0] === pieceTagMap.white.rook ||
            pinningPiece[0] === pieceTagMap.white.queen)
        ) {
          direction = blackKingDir;
          isPinning = true;
        }
      }
    }
  }

  return [isPinning, direction];
};
