/* general function shared in game page components */

import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { PieceColor } from "../objects/entitiesEnums";
import { PieceTagMap, pieceTagMap } from "../objects/piecesNameMaps";
import { PlayerDto } from "../types/abstractDtosAndModels";
import { Coordinate, CoorNumber } from "./types";

// check if player can move
export const checkIfPlayerTurn = (turn: number, color: PieceColor | null): boolean => {
  if (color === null) return false;

  return (turn % 2 === 0 && color === PieceColor.white) || (turn % 2 === 1 && color === PieceColor.black);
};

// check if coordinates are the same
export const areCoorEqual = (coordA: Coordinate, coordB: Coordinate): boolean => {
  if (!coordA || !coordB) return false;

  return coordA[0] === coordB[0] && coordA[1] === coordB[1];
};

// to check if clicked piece is own or opponents piece
export const checkIfOwnPiece = (char: WhitePieceTag | BlackPieceTag, playerData: PlayerDto): boolean => {
  let isOwn: boolean = false;

  for (const color in pieceTagMap) {
    const pieces = pieceTagMap[color as keyof PieceTagMap];

    if (Object.values(pieces).includes(char)) {
      if (playerData.color === PieceColor[color as keyof typeof PieceColor]) {
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
export const posToIndex = (coord: Coordinate): number => {
  if (!coord) return -1;

  const x = coord[0] - 1;
  const y = Math.abs(coord[1] - 1 - 7);

  return y * 8 + x;
};

// type converters
export const toCoor = (coor: number[]): Coordinate => coor as Coordinate;
export const toCoorNum = (num: number): CoorNumber => num as CoorNumber;
