import { pieceColor } from "../../../shared/utils/enums/entitiesEnums";
import {
  PieceTagMap,
  pieceTagMap,
} from "../../../shared/utils/enums/piecesMaps";
import { GetPlayerDto } from "../../../shared/utils/types/gameDtos";

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

export const checkCoordinatesEquality = (
  coor: number[],
  selectedCoor: number[]
): boolean => {
  if (coor[0] === selectedCoor[0] && coor[1] === selectedCoor[1]) {
    return true;
  }
  return false;
};

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
