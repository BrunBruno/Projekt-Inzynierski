import { pieceColor } from "../../../shared/utils/enums/entitiesEnums";
import { pieceTagMap } from "../../../shared/utils/enums/piecesMaps";
import { movementMap } from "../../../shared/utils/enums/piecesMovementMap";
import { GetPlayerDto } from "../../../shared/utils/types/gameDtos";

class ShowTip {
  private readonly directions = {
    ver: "ver",
    hor: "hor",
    btd: "btd",
    tbd: "tbd",
  };

  private playerColor: { [key: string]: string } = {};
  private matrix: string[][] = [];

  // generate areas when pieces can move to
  public showTip = (
    player: GetPlayerDto,
    matrix: string[][],
    whiteAreas: number[][],
    blackAreas: number[][],
    field: number[],
    pieceTag: string,
    whiteChecks: number[][],
    blackChecks: number[][]
  ): number[][] => {
    this.matrix = matrix;

    let tipFields: number[][] = [field];
    const color: number | null = player.color;
    const xCoor: number = field[0];
    const yCoor: number = field[1];

    let foundTips: number[][] = [];

    if (color === pieceColor.white) {
      this.playerColor = pieceTagMap.white;
    }
    if (color === pieceColor.black) {
      this.playerColor = pieceTagMap.black;
    }

    let directionVector: number[][] | null = null;
    const [isPinned, direction] = this.checkPin(xCoor, yCoor, pieceTag);
    if (isPinned) {
      directionVector = this.getDirectionVectors(direction);
    }

    switch (pieceTag) {
      case pieceTagMap.white.pawn:
      case pieceTagMap.black.pawn:
        foundTips = this.checkPawnMove(xCoor, yCoor, directionVector);
        break;
      case pieceTagMap.white.knight:
      case pieceTagMap.black.knight:
        if (!isPinned) {
          foundTips = this.checkKnightMoves(xCoor, yCoor);
        }
        break;
      case pieceTagMap.white.bishop:
      case pieceTagMap.black.bishop:
        foundTips = this.checkPiecesMoves(
          xCoor,
          yCoor,
          movementMap.bishopMoves,
          directionVector
        );
        break;
      case pieceTagMap.white.rook:
      case pieceTagMap.black.rook:
        foundTips = this.checkPiecesMoves(
          xCoor,
          yCoor,
          movementMap.rookMoves,
          directionVector
        );
        break;
      case pieceTagMap.white.queen:
      case pieceTagMap.black.queen:
        foundTips = this.checkPiecesMoves(
          xCoor,
          yCoor,
          movementMap.queenMoves,
          directionVector
        );
        break;
      case pieceTagMap.white.king:
        foundTips = this.checkKingMoves(xCoor, yCoor, blackAreas);
        break;
      case pieceTagMap.black.king:
        foundTips = this.checkKingMoves(xCoor, yCoor, whiteAreas);
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
          blackChecks.some(
            (check) => check[0] === tip[0] && check[1] === tip[1]
          )
        );
      }
      if (color === pieceColor.black && whiteChecks.length > 0) {
        tipFields = tipFields.filter((tip) =>
          whiteChecks.some(
            (check) => check[0] === tip[0] && check[1] === tip[1]
          )
        );
      }
    }

    return tipFields;
  };

  // isValid | isEmpty
  private isValidAndIsEmptyField = (x: number, y: number): boolean[] => {
    let isValid: boolean = false;
    let isEmpty: boolean = false;

    if (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
      const piece = this.matrix[y - 1][x - 1];
      if (piece === "") {
        isEmpty = true;
      }

      const isOwnPiece = Object.values(this.playerColor).includes(piece);
      isValid = !isOwnPiece;
    }

    return [isValid, isEmpty];
  };

  private checkPawnMove = (
    xCoor: number,
    yCoor: number,
    directions: number[][] | null
  ): number[][] => {
    const tipFields: number[][] = [];

    let dir: number | null = null;
    if (directions !== null) {
      dir = directions[0][0] * directions[0][1];
    }

    if (this.playerColor === pieceTagMap.white) {
      let firstIsValid: boolean = false;

      let x: number = xCoor;
      let y: number = yCoor + 1;
      let [isValid, isEmpy]: boolean[] = this.isValidAndIsEmptyField(x, y);

      if (isValid && isEmpy && (dir === null || dir === 0)) {
        firstIsValid = true;
        tipFields.push([x, y]);
      }

      x = xCoor + 1;
      y = yCoor + 1;
      [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);
      if (isValid && !isEmpy && (dir === null || dir > 0)) {
        tipFields.push([x, y]);
      }

      x = xCoor - 1;
      y = yCoor + 1;
      [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);
      if (isValid && !isEmpy && (dir === null || dir < 0)) {
        tipFields.push([x, y]);
      }

      if (yCoor === 2 && firstIsValid) {
        x = xCoor;
        y = yCoor + 2;
        [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);

        if (isValid && isEmpy && (dir === null || dir === 0)) {
          tipFields.push([x, y]);
        }
      }
    }

    if (this.playerColor === pieceTagMap.black) {
      let firstIsValid: boolean = false;

      let x: number = xCoor;
      let y: number = yCoor - 1;
      let [isValid, isEmpy]: boolean[] = this.isValidAndIsEmptyField(x, y);

      if (isValid && isEmpy && (dir === null || dir === 0)) {
        firstIsValid = true;
        tipFields.push([x, y]);
      }

      x = xCoor + 1;
      y = yCoor - 1;
      [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);
      if (isValid && !isEmpy && (dir === null || dir < 0)) {
        tipFields.push([x, y]);
      }

      x = xCoor - 1;
      y = yCoor - 1;
      [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);
      if (isValid && !isEmpy && (dir === null || dir > 0)) {
        tipFields.push([x, y]);
      }

      if (yCoor === 7 && firstIsValid) {
        x = xCoor;
        y = yCoor - 2;
        [isValid, isEmpy] = this.isValidAndIsEmptyField(x, y);

        if (isValid && isEmpy && (dir === null || dir === 0)) {
          tipFields.push([x, y]);
        }
      }
    }

    return tipFields;
  };

  private checkKnightMoves = (xCoor: number, yCoor: number): number[][] => {
    const tipFields: number[][] = [];

    for (const [dx, dy] of movementMap.knightMoves) {
      const x = xCoor + dx;
      const y = yCoor + dy;

      const [isValid, isEmpty] = this.isValidAndIsEmptyField(x, y);
      if (isValid) {
        tipFields.push([x, y]);
      }
    }

    return tipFields;
  };

  private checkPiecesMoves = (
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

      let [isValid, isEmpty] = this.isValidAndIsEmptyField(x, y);
      while (isValid) {
        tipFields.push([x, y]);

        if (!isEmpty) {
          break;
        }

        x += dx;
        y += dy;

        [isValid, isEmpty] = this.isValidAndIsEmptyField(x, y);
      }
    }

    return tipFields;
  };

  private checkKingMoves = (
    xCoor: number,
    yCoor: number,
    areas: number[][]
  ): number[][] => {
    const tipFields: number[][] = [];

    for (const [dx, dy] of movementMap.kingMoves) {
      const x = xCoor + dx;
      const y = yCoor + dy;

      const [isValid, isEmpty] = this.isValidAndIsEmptyField(x, y);

      const isInArea = areas.some((coord) => coord[0] === x && coord[1] === y);

      if (isValid && !isInArea) {
        tipFields.push([x, y]);
      }
    }

    return tipFields;
  };

  private getDirectionVectors = (direction: string): number[][] | null => {
    const directionMap: { [key: string]: number[][] } = {
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

    return directionMap[direction] || null;
  };

  private checkDirection = (x: number, y: number): string => {
    if (x === 0) return this.directions.ver;
    if (y === 0) return this.directions.hor;
    if (x * y < 0) return this.directions.tbd;
    if (x * y > 0) return this.directions.btd;
    return "";
  };

  // check if piece is pinned (return isPinned, direction of pin)
  private checkPin = (
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

    // in form [piece, direction]
    const foundPieces: string[][] = [];

    for (const [dx, dy] of movementMap.bishopMoves) {
      let x = xCoor + dx;
      let y = yCoor + dy;

      while (x >= 1 && x <= 8 && y >= 1 && y <= 8) {
        const piece = this.matrix[y - 1][x - 1];
        if (piece !== "") {
          const dir = this.checkDirection(dx, dy);
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
        const piece = this.matrix[y - 1][x - 1];

        if (piece !== "") {
          const dir = this.checkDirection(dx, dy);
          foundPieces.push([piece, dir]);
          break;
        }

        x += dx;
        y += dy;
      }
    }

    let isPinning: boolean = false;
    let direction: string = "";

    if (this.playerColor === pieceTagMap.white) {
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
            (whiteKingDir === this.directions.btd ||
              whiteKingDir === this.directions.tbd) &&
            (pinningPiece[0] === pieceTagMap.black.bishop ||
              pinningPiece[0] === pieceTagMap.black.queen)
          ) {
            direction = whiteKingDir;
            isPinning = true;
          }
          if (
            (whiteKingDir === this.directions.hor ||
              whiteKingDir === this.directions.ver) &&
            (pinningPiece[0] === pieceTagMap.black.rook ||
              pinningPiece[0] === pieceTagMap.black.queen)
          ) {
            direction = whiteKingDir;
            isPinning = true;
          }
        }
      }
    }
    if (this.playerColor === pieceTagMap.black) {
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
            (blackKingDir === this.directions.btd ||
              blackKingDir === this.directions.tbd) &&
            (pinningPiece[0] === pieceTagMap.white.bishop ||
              pinningPiece[0] === pieceTagMap.white.queen)
          ) {
            direction = blackKingDir;
            isPinning = true;
          }
          if (
            (blackKingDir === this.directions.hor ||
              blackKingDir === this.directions.ver) &&
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
}

export default new ShowTip();
