import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import {
  PieceTagMap,
  pieceTagMap,
} from "../../../../shared/utils/enums/piecesMaps";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";

// check if player can move
export const checkIfPlayerTurn = (
  turn: number,
  color: number | null
): boolean => {
  if (
    (turn % 2 === 0 && color === pieceColor.white) ||
    (turn % 2 === 1 && color === pieceColor.black)
  ) {
    return true;
  }
  return false;
};

// check if coordinates are the same
export const checkCoordinatesEquality = (
  coor: number[],
  selectedCoor: number[]
): boolean => {
  if (coor[0] === selectedCoor[0] && coor[1] === selectedCoor[1]) {
    return true;
  }

  return false;
};

// to check if clicked piece is own or opponents piece
export const checkIfOwnPiece = (
  char: string,
  playerData: GetPlayerDto
): boolean => {
  for (const color in pieceTagMap) {
    const pieces = pieceTagMap[color as keyof PieceTagMap];

    if (Object.values(pieces).includes(char)) {
      if (playerData.color === pieceColor[color]) {
        return true;
      }
    }
  }

  return false;
};

export const intToChar = (i: number): string => {
  return String.fromCharCode(65 + (i - 1));
};
