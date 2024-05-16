import { pieceTagMap } from "../../../../shared/utils/enums/piecesMaps";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { CastleOptions } from "../../../../shared/utils/types/commonTypes";
import { checkCoordinatesEquality, intToChar } from "./ExtraFunctions";

class MakeMove {
  private matrix: string[][] = [];

  // make move
  public makeMove = async (
    gameId: string,
    matrix: string[][],
    piece: string,
    oldCoordinates: number[],
    newCoordinates: number[],
    enPassant: string | null,
    castleOptions: CastleOptions | null
  ) => {
    this.matrix = matrix;

    const newX = newCoordinates[0];
    const newY = newCoordinates[1];

    const oldX = oldCoordinates[0];
    const oldY = oldCoordinates[1];

    const capture = matrix[newY - 1][newX - 1] === "" ? "" : "x";
    matrix[oldY - 1][oldX - 1] = "";
    matrix[newY - 1][newX - 1] = piece;

    // perform enpassanted pawn
    let enPassantCoor: number[] | null = null;
    if (enPassant) {
      enPassantCoor = enPassant.split(",").map(Number);

      if (piece === pieceTagMap.white.pawn) {
        if (checkCoordinatesEquality(enPassantCoor, [newX, newY])) {
          matrix[newY - 1 - 1][newX - 1] = "";
        }
      }

      if (piece === pieceTagMap.black.pawn) {
        if (checkCoordinatesEquality(enPassantCoor, [newX, newY])) {
          matrix[newY - 1 + 1][newX - 1] = "";
        }
      }
    }

    //perform castling
    if (castleOptions) {
      if (piece === pieceTagMap.white.king && castleOptions.cwkc) {
        if (newX === 3) {
          matrix[0][1 - 1] = "";
          matrix[0][4 - 1] = pieceTagMap.white.rook;
        }
        if (newX === 7) {
          matrix[0][8 - 1] = "";
          matrix[0][6 - 1] = pieceTagMap.white.rook;
        }
      }
      if (piece === pieceTagMap.black.king && castleOptions.cbkc) {
        if (newX === 3) {
          matrix[7][1 - 1] = "";
          matrix[7][4 - 1] = pieceTagMap.black.rook;
        }
        if (newX === 7) {
          matrix[7][1 - 1] = "";
          matrix[7][4 - 1] = pieceTagMap.black.rook;
        }
      }
    }

    const newPosition = this.makeNewPosition();

    const donrMove = piece + capture + intToChar(newX) + newY;

    // check for en passant possibility
    let newEnPassant: string | null = null;
    if (piece === pieceTagMap.white.pawn && oldY === 2 && newY === 4) {
      newEnPassant = newX + ",3";
    } else if (piece === pieceTagMap.black.pawn && oldY === 7 && newY === 5) {
      newEnPassant = newX + ",6";
    }

    // check for casteling possibility
    const wkm = piece === pieceTagMap.white.king;
    const wsrm = piece === pieceTagMap.white.rook && oldX === 8 && oldY === 1;
    const wlsr = piece === pieceTagMap.white.rook && oldX === 1 && oldY === 1;
    const bkm = piece === pieceTagMap.black.king;
    const bsrm = piece === pieceTagMap.black.rook && oldX === 8 && oldY === 8;
    const blsr = piece === pieceTagMap.black.rook && oldX === 1 && oldY === 8;

    GameHubService.MakeMove(
      gameId,
      newPosition,
      donrMove,
      newEnPassant,
      wkm,
      wsrm,
      wlsr,
      bkm,
      bsrm,
      blsr
    );
  };

  // update string positio after move was dane
  private makeNewPosition = (): string => {
    const matrix = this.matrix.reverse();
    let newPosition = "";

    for (let row in matrix) {
      let emptyCount: number = 0;

      for (let col in matrix[row]) {
        const field = matrix[row][col];

        if (field === "") {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            newPosition += emptyCount.toString();
            emptyCount = 0;
          }
          newPosition += matrix[row][col];
        }
      }

      if (emptyCount > 0) {
        newPosition += emptyCount.toString();
      }

      newPosition += "/";
    }

    newPosition = newPosition.slice(0, -1);

    return newPosition;
  };
}

export default new MakeMove();
