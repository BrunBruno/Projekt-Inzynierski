import { pieceColor } from "../../../shared/utils/enums/pieceColorEnum";
import { pieceTagMap } from "../../../shared/utils/enums/piecesMaps";
import { movementMap } from "../../../shared/utils/enums/piecesMovementMap";

let boardMatrix: string[][] = [];

// create [white controlled areas, black Controlled areas]
export const generateControlledAreas = (
  matrix: string[][]
): [number[][], number[][]] => {
  const whiteControlledAreas: Set<number[]> = new Set();
  const blackControlledAreas: Set<number[]> = new Set();

  boardMatrix = matrix;

  for (let row in matrix) {
    for (let col in matrix[row]) {
      const piece = matrix[row][col];

      const xCoor = parseInt(col) + 1;
      const yCoor = parseInt(row) + 1;
      let foundWhiteAreas: Set<number[]> = new Set();
      let foundBlackAreas: Set<number[]> = new Set();

      switch (piece) {
        case pieceTagMap.white.pawn:
          foundWhiteAreas = new Set(
            checkPawnControlledAreas(xCoor, yCoor, pieceTagMap.white)
          );
          break;
        case pieceTagMap.black.pawn:
          foundBlackAreas = new Set(
            checkPawnControlledAreas(xCoor, yCoor, pieceTagMap.black)
          );
          break;
        case pieceTagMap.white.knight:
          foundWhiteAreas = new Set(checkKnightControlledAreas(xCoor, yCoor));
          break;
        case pieceTagMap.black.knight:
          foundBlackAreas = new Set(checkKnightControlledAreas(xCoor, yCoor));
          break;
        case pieceTagMap.white.bishop:
          foundWhiteAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.bishopMoves,
              pieceColor.white
            )
          );
          break;
        case pieceTagMap.black.bishop:
          foundBlackAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.bishopMoves,
              pieceColor.black
            )
          );
          break;
        case pieceTagMap.white.rook:
          foundWhiteAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.rookMoves,
              pieceColor.white
            )
          );
          break;
        case pieceTagMap.black.rook:
          foundBlackAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.rookMoves,
              pieceColor.black
            )
          );
          break;
        case pieceTagMap.white.queen:
          foundWhiteAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.queenMoves,
              pieceColor.white
            )
          );
          break;
        case pieceTagMap.black.queen:
          foundBlackAreas = new Set(
            checkPiecesControlledAreas(
              xCoor,
              yCoor,
              movementMap.queenMoves,
              pieceColor.black
            )
          );
          break;
        case pieceTagMap.white.king:
          foundWhiteAreas = new Set(checkKingControlledAreas(xCoor, yCoor));
          break;
        case pieceTagMap.black.king:
          foundBlackAreas = new Set(checkKingControlledAreas(xCoor, yCoor));
          break;
        default:
          break;
      }

      foundWhiteAreas.forEach((coord) => whiteControlledAreas.add(coord));
      foundBlackAreas.forEach((coord) => blackControlledAreas.add(coord));
    }
  }

  return [Array.from(whiteControlledAreas), Array.from(blackControlledAreas)];
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

    isValid = true;
  }

  return [isValid, isEmpty];
};

// controlled areas with pawns
const checkPawnControlledAreas = (
  xCoor: number,
  yCoor: number,
  color: { [key: string]: string }
): number[][] => {
  const areas: number[][] = [];

  if (color === pieceTagMap.white) {
    let x: number;
    let y: number;
    let [isValid, isEmpy]: boolean[] = [];

    x = xCoor + 1;
    y = yCoor + 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }

    x = xCoor - 1;
    y = yCoor + 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }
  }

  if (color === pieceTagMap.black) {
    let x: number;
    let y: number;
    let [isValid, isEmpy]: boolean[] = [];

    x = xCoor + 1;
    y = yCoor - 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }

    x = xCoor - 1;
    y = yCoor - 1;
    [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }
  }

  return areas;
};

// controlled areas with knights
const checkKnightControlledAreas = (
  xCoor: number,
  yCoor: number
): number[][] => {
  const areas: number[][] = [];

  for (const [dx, dy] of movementMap.knightMoves) {
    const x = xCoor + dx;
    const y = yCoor + dy;

    const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }
  }

  return areas;
};

// controlled areas with rest of pieces
const checkPiecesControlledAreas = (
  xCoor: number,
  yCoor: number,
  pieceMoves: number[][],
  color: number
): number[][] => {
  const areas: number[][] = [];

  for (const [dx, dy] of pieceMoves) {
    let x = xCoor + dx;
    let y = yCoor + dy;

    let [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    while (isValid) {
      areas.push([x, y]);

      const piece = boardMatrix[y - 1][x - 1];
      let kingFound: boolean = false;
      if (
        (piece === pieceTagMap.white.king && color === pieceColor.black) ||
        (piece === pieceTagMap.black.king && color === pieceColor.white)
      ) {
        kingFound = true;
      }
      if (!isEmpty && !kingFound) {
        break;
      }

      x += dx;
      y += dy;

      [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    }
  }

  return areas;
};

// controlled areas with kings
const checkKingControlledAreas = (xCoor: number, yCoor: number): number[][] => {
  const areas: number[][] = [];

  for (const [dx, dy] of movementMap.kingMoves) {
    const x = xCoor + dx;
    const y = yCoor + dy;

    const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
    if (isValid) {
      areas.push([x, y]);
    }
  }

  return areas;
};

// creates areas that are involved in checking
export const checkChecks = (matrix: string[][]): [number[][], number[][]] => {
  const whiteCheckAreas: number[][] = [];
  const blackCheckAreas: number[][] = [];

  let whiteKingPosition: number[] | null = null;
  let blackKingPosition: number[] | null = null;

  for (let i = 0; i < matrix.length; i++) {
    if (whiteKingPosition !== null && blackKingPosition !== null) {
      break;
    }

    for (let j = 0; j < matrix[i].length; j++) {
      if (whiteKingPosition !== null && blackKingPosition !== null) {
        break;
      }

      if (matrix[i][j] === pieceTagMap.white.king) {
        whiteKingPosition = [j + 1, i + 1];
      }
      if (matrix[i][j] === pieceTagMap.black.king) {
        blackKingPosition = [j + 1, i + 1];
      }
    }
  }

  if (whiteKingPosition && blackKingPosition) {
    const [wx, wy] = whiteKingPosition;
    const [bx, by] = blackKingPosition;

    if (matrix[wy - 1 + 1][wx - 1 + 1] === pieceTagMap.black.pawn) {
      blackCheckAreas.push([wx + 1, wy + 1]);
    }
    if (matrix[wy - 1 + 1][wx - 1 - 1] === pieceTagMap.black.pawn) {
      blackCheckAreas.push([wx - 1, wy + 1]);
    }

    blackCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        wx,
        wy,
        checkKnightControlledAreas(wx, wy),
        pieceTagMap.black.knight,
        false
      )
    );

    blackCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        wx,
        wy,
        checkPiecesControlledAreas(
          wx,
          wy,
          movementMap.bishopMoves,
          pieceColor.white
        ),
        pieceTagMap.black.bishop,
        true
      )
    );

    blackCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        wx,
        wy,
        checkPiecesControlledAreas(
          wx,
          wy,
          movementMap.rookMoves,
          pieceColor.white
        ),
        pieceTagMap.black.rook,
        true
      )
    );

    blackCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        wx,
        wy,
        checkPiecesControlledAreas(
          wx,
          wy,
          movementMap.queenMoves,
          pieceColor.white
        ),
        pieceTagMap.black.queen,
        true
      )
    );

    if (matrix[by - 1 - 1][bx - 1 + 1] === pieceTagMap.white.pawn) {
      whiteCheckAreas.push([bx + 1, by - 1]);
    }
    if (matrix[by - 1 - 1][bx - 1 - 1] === pieceTagMap.white.pawn) {
      whiteCheckAreas.push([bx - 1, by - 1]);
    }

    whiteCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        bx,
        by,
        checkKnightControlledAreas(bx, by),
        pieceTagMap.white.knight,
        false
      )
    );

    whiteCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        bx,
        by,
        checkPiecesControlledAreas(
          bx,
          by,
          movementMap.bishopMoves,
          pieceColor.black
        ),
        pieceTagMap.white.bishop,
        true
      )
    );

    whiteCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        bx,
        by,
        checkPiecesControlledAreas(
          bx,
          by,
          movementMap.rookMoves,
          pieceColor.black
        ),
        pieceTagMap.white.rook,
        true
      )
    );

    whiteCheckAreas.push(
      ...checkAndAddCheckedAreas(
        matrix,
        bx,
        by,
        checkPiecesControlledAreas(
          bx,
          by,
          movementMap.queenMoves,
          pieceColor.black
        ),
        pieceTagMap.white.queen,
        true
      )
    );
  }

  return [whiteCheckAreas, blackCheckAreas];
};

// add checked areas
const checkAndAddCheckedAreas = (
  matrix: string[][],
  x: number,
  y: number,
  areas: number[][],
  pieceType: string,
  isLinearMovement: boolean
): number[][] => {
  const foundCheckAreas: number[][] = [];

  areas.forEach((area) => {
    const piece = matrix[area[1] - 1][area[0] - 1];
    if (piece === pieceType) {
      if (isLinearMovement) {
        const distanceX = x - area[0];
        const distanceY = y - area[1];
        const stepX = distanceX > 0 ? -1 : distanceX < 0 ? 1 : 0;
        const stepY = distanceY > 0 ? -1 : distanceY < 0 ? 1 : 0;
        const steps = Math.max(Math.abs(distanceX), Math.abs(distanceY));
        for (let i = 1; i <= steps; i++) {
          foundCheckAreas.push([x + i * stepX, y + i * stepY]);
        }
      } else {
        foundCheckAreas.push(area);
      }
    }
  });

  return foundCheckAreas;
};
