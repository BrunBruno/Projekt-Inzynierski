import { pieceTagMap } from "../../../shared/utils/enums/piecesMaps";
import { movementMap } from "../../../shared/utils/enums/piecesMovementMap";

let boardMatrix: string[][] = [];

export const checkAreas = (matrix: string[][]): [number[][], number[][]] => {
    const whiteControledAreas: Set<number[]> = new Set();
    const blackControledAreas: Set<number[]> = new Set();

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
                        checkPawnControledAreas(xCoor, yCoor, pieceTagMap.white)
                    );
                    break;
                case pieceTagMap.black.pawn:
                    foundBlackAreas = new Set(
                        checkPawnControledAreas(xCoor, yCoor, pieceTagMap.black)
                    );
                    break;
                case pieceTagMap.white.knight:
                    foundWhiteAreas = new Set(
                        checkKnightControledAreas(xCoor, yCoor)
                    );
                    break;
                case pieceTagMap.black.knight:
                    foundBlackAreas = new Set(
                        checkKnightControledAreas(xCoor, yCoor)
                    );
                    break;
                case pieceTagMap.white.bishop:
                    foundWhiteAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.bishopMoves
                        )
                    );
                    break;
                case pieceTagMap.black.bishop:
                    foundBlackAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.bishopMoves
                        )
                    );
                    break;
                case pieceTagMap.white.rook:
                    foundWhiteAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.rookMoves
                        )
                    );
                    break;
                case pieceTagMap.black.rook:
                    foundBlackAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.rookMoves
                        )
                    );
                    break;
                case pieceTagMap.white.queen:
                    foundWhiteAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.queenMoves
                        )
                    );
                    break;
                case pieceTagMap.black.queen:
                    foundBlackAreas = new Set(
                        checkPiecesControledAreas(
                            xCoor,
                            yCoor,
                            movementMap.queenMoves
                        )
                    );
                    break;
                case pieceTagMap.white.king:
                    foundWhiteAreas = new Set(
                        checkKingControledAreas(xCoor, yCoor)
                    );
                    break;
                case pieceTagMap.black.king:
                    foundBlackAreas = new Set(
                        checkKingControledAreas(xCoor, yCoor)
                    );
                    break;
                default:
                    break;
            }

            foundWhiteAreas.forEach((coord) => whiteControledAreas.add(coord));
            foundBlackAreas.forEach((coord) => blackControledAreas.add(coord));
        }
    }

    return [Array.from(whiteControledAreas), Array.from(blackControledAreas)];
};

// isValid / isEmpty
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

const checkPawnControledAreas = (
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

const checkKnightControledAreas = (
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

const checkPiecesControledAreas = (
    xCoor: number,
    yCoor: number,
    pieceMoves: number[][]
): number[][] => {
    const areas: number[][] = [];

    for (const [dx, dy] of pieceMoves) {
        let x = xCoor + dx;
        let y = yCoor + dy;

        let [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
        while (isValid) {
            areas.push([x, y]);

            if (!isEmpty) {
                break;
            }

            x += dx;
            y += dy;

            [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
        }
    }

    return areas;
};

const checkKingControledAreas = (xCoor: number, yCoor: number): number[][] => {
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
