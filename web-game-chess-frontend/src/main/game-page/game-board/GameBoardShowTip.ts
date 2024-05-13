import { pieceColor } from "../../../shared/utils/enums/pieceColorEnum";
import { pieceTagMap } from "../../../shared/utils/enums/piecesMaps";
import { movementMap } from "../../../shared/utils/enums/piecesMovementMap";
import { GetPlayerDto } from "../../../shared/utils/types/gameDtos";

let playerColor: { [key: string]: string } = {};
let boardMatrix: string[][] = [];

export const showTip = (
    player: GetPlayerDto,
    matrix: string[][],

    whiteAreas: number[][],
    blackAreas: number[][],

    field: number[],
    pieceTag: string
): number[][] => {
    boardMatrix = matrix;

    const tipFileds: number[][] = [field];
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

    switch (pieceTag) {
        case pieceTagMap.white.pawn:
        case pieceTagMap.black.pawn:
            foundTips = checkPawnMove(xCoor, yCoor);
            break;
        case pieceTagMap.white.knight:
        case pieceTagMap.black.knight:
            foundTips = checkKnightMoves(xCoor, yCoor);
            break;
        case pieceTagMap.white.bishop:
        case pieceTagMap.black.bishop:
            foundTips = checkPiecesMoves(xCoor, yCoor, movementMap.bishopMoves);
            break;
        case pieceTagMap.white.rook:
        case pieceTagMap.black.rook:
            foundTips = checkPiecesMoves(xCoor, yCoor, movementMap.rookMoves);
            break;
        case pieceTagMap.white.queen:
        case pieceTagMap.black.queen:
            foundTips = checkPiecesMoves(xCoor, yCoor, movementMap.queenMoves);
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

    tipFileds.push(...foundTips);

    return tipFileds;
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

        const isOwnPiece = Object.values(playerColor).includes(piece);
        isValid = !isOwnPiece;
    }

    return [isValid, isEmpty];
};

const checkPawnMove = (xCoor: number, yCoor: number): number[][] => {
    const tipFileds: number[][] = [];

    if (playerColor === pieceTagMap.white) {
        let firstIsValid: boolean = false;

        let x: number = xCoor;
        let y: number = yCoor + 1;
        let [isValid, isEmpy]: boolean[] = isValidAndIsEmptyField(x, y);

        if (isValid && isEmpy) {
            firstIsValid = true;
            tipFileds.push([x, y]);
        }

        x = xCoor + 1;
        y = yCoor + 1;
        [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
        if (isValid && !isEmpy) {
            tipFileds.push([x, y]);
        }

        x = xCoor - 1;
        y = yCoor + 1;
        [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
        if (isValid && !isEmpy) {
            tipFileds.push([x, y]);
        }

        if (yCoor === 2 && firstIsValid) {
            x = xCoor;
            y = yCoor + 2;
            [isValid, isEmpy] = isValidAndIsEmptyField(x, y);

            if (isValid && isEmpy) {
                tipFileds.push([x, y]);
            }
        }
    }

    if (playerColor === pieceTagMap.black) {
        let firstIsValid: boolean = false;

        let x: number = xCoor;
        let y: number = yCoor - 1;
        let [isValid, isEmpy]: boolean[] = isValidAndIsEmptyField(x, y);

        if (isValid && isEmpy) {
            firstIsValid = true;
            tipFileds.push([x, y]);
        }

        x = xCoor + 1;
        y = yCoor - 1;
        [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
        if (isValid && !isEmpy) {
            tipFileds.push([x, y]);
        }

        x = xCoor - 1;
        y = yCoor - 1;
        [isValid, isEmpy] = isValidAndIsEmptyField(x, y);
        if (isValid && !isEmpy) {
            tipFileds.push([x, y]);
        }

        if (yCoor === 7 && firstIsValid) {
            x = xCoor;
            y = yCoor - 2;
            [isValid, isEmpy] = isValidAndIsEmptyField(x, y);

            if (isValid && isEmpy) {
                tipFileds.push([x, y]);
            }
        }
    }

    return tipFileds;
};

const checkKnightMoves = (xCoor: number, yCoor: number): number[][] => {
    const tipFileds: number[][] = [];

    for (const [dx, dy] of movementMap.knightMoves) {
        const x = xCoor + dx;
        const y = yCoor + dy;

        const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
        if (isValid) {
            tipFileds.push([x, y]);
        }
    }

    return tipFileds;
};

const checkPiecesMoves = (
    xCoor: number,
    yCoor: number,
    pieceMoves: number[][]
): number[][] => {
    const tipFileds: number[][] = [];

    for (const [dx, dy] of pieceMoves) {
        let x = xCoor + dx;
        let y = yCoor + dy;

        let [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
        while (isValid) {
            tipFileds.push([x, y]);

            if (!isEmpty) {
                break;
            }

            x += dx;
            y += dy;

            [isValid, isEmpty] = isValidAndIsEmptyField(x, y);
        }
    }

    return tipFileds;
};

const checkKingMoves = (
    xCoor: number,
    yCoor: number,
    areas: number[][]
): number[][] => {
    const tipFileds: number[][] = [];

    for (const [dx, dy] of movementMap.kingMoves) {
        const x = xCoor + dx;
        const y = yCoor + dy;

        const [isValid, isEmpty] = isValidAndIsEmptyField(x, y);

        const isInArea = areas.some(
            (coord) => coord[0] === x && coord[1] === y
        );

        if (isValid && !isInArea) {
            tipFileds.push([x, y]);
        }
    }

    return tipFileds;
};
