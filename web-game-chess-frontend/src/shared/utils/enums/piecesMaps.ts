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

type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PieceTagMap = {
  white: {
    [key in PieceType]: string;
  };
  black: {
    [key in PieceType]: string;
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
