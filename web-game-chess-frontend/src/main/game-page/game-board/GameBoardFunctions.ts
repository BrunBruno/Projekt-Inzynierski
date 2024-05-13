import { pieceColor } from "../../../shared/utils/enums/pieceColorEnum";

export const checkCoordinatesEquality = (
    coor: number[],
    selectedCoor: number[]
): boolean => {
    if (coor[0] === selectedCoor[0] && coor[1] === selectedCoor[1]) {
        return true;
    }
    return false;
};

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
