import { pieceColor } from "../enums/entitiesEnums";
import { PieceTagMap, pieceTagMap } from "../enums/piecesMaps";
import { GetPlayerDto } from "../types/gameDtos";

// check if player can move
export const checkIfPlayerTurn = (turn: number, color: number | null): boolean => {
  if (color === null) return false;

  return (turn % 2 === 0 && color === pieceColor.white) || (turn % 2 === 1 && color === pieceColor.black);
};

// check if coordinates are the same
export const areCoorEqual = (coordA: number[], coordB: number[]): boolean => {
  return coordA[0] === coordB[0] && coordA[1] === coordB[1];
};

// to check if clicked piece is own or opponents piece
export const checkIfOwnPiece = (char: string, playerData: GetPlayerDto): boolean => {
  let isOwn: boolean = false;
  for (const color in pieceTagMap) {
    const pieces = pieceTagMap[color as keyof PieceTagMap];

    if (Object.values(pieces).includes(char)) {
      if (playerData.color === pieceColor[color]) {
        isOwn = true;
        break;
      }
    }
  }

  return isOwn;
};

// convert from int to char for board files
export const intToChar = (i: number): string => {
  return String.fromCharCode(65 + (i - 1));
};

// covert from coordinates to index
export const PosToIndex = (coord: number[]): number => {
  const x = coord[0] - 1;
  const y = Math.abs(coord[1] - 1 - 7);

  return y * 8 + x;
};
