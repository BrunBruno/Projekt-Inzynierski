export const pieceImageMap: { [key: string]: string } = {
    R: "white-rook.png",
    N: "white-knight.png",
    B: "white-bishop.png",
    Q: "white-queen.png",
    K: "white-king.png",
    P: "white-pawn.png",
    r: "black-rook.png",
    n: "black-knight.png",
    b: "black-bishop.png",
    q: "black-queen.png",
    k: "black-king.png",
    p: "black-pawn.png",
};

type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PieceTagMap = {
    white: {
        [key in PieceType]: string;
    };
    black: {
        [key in PieceType]: string;
    };
};

export const pieceTagMap: PieceTagMap = {
    white: {
        pawn: "P",
        knight: "N",
        bishop: "B",
        rook: "R",
        queen: "Q",
        king: "K",
    },
    black: {
        pawn: "p",
        knight: "n",
        bishop: "b",
        rook: "r",
        queen: "q",
        king: "k",
    },
};
