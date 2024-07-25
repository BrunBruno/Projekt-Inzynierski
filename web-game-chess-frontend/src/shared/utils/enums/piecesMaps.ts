// maps for kinds of pieces

type PiecesImageMap = {
  [key: string]: string;
};

// map from key letter to image path
export const pieceImageMap: PiecesImageMap = {
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

type PieceTagType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PieceTagMap = {
  white: {
    [key in PieceTagType]: string;
  };
  black: {
    [key in PieceTagType]: string;
  };
};

// to convert from tag to object with prop
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
export type WhitePieceType = typeof pieceTagMap.white[keyof typeof pieceTagMap.white];
export type BlackPieceType = typeof pieceTagMap.black[keyof typeof pieceTagMap.black];

export type PiecePromotionMap = {
  white: string[];
  black: string[];
};

// piece promotion tag maps
export const piecePromotionMap: PiecePromotionMap = {
  white: ["N", "B", "R", "Q"],
  black: ["n", "b", "r", "q"],
};
