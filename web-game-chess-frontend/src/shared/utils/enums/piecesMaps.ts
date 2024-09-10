/* maps for kinds of pieces */

const pieceName = { p: "Pawn", n: "Knight", b: "Bishop", r: "Rook", q: "Queen", k: "King" };

// to game piece name by piece tag
export const getPieceName = (char: string): string => {
  return pieceName[char.toLowerCase() as keyof typeof pieceName] || "Unknown";
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

export type WhitePieceType = (typeof pieceTagMap.white)[keyof typeof pieceTagMap.white];
export type BlackPieceType = (typeof pieceTagMap.black)[keyof typeof pieceTagMap.black];

// to gat side color name by piece tag
export const getPiecesSideColor = (piece: string): string => {
  if (Object.values(pieceTagMap.white).includes(piece)) {
    return "white";
  } else if (Object.values(pieceTagMap.black).includes(piece)) {
    return "black";
  } else {
    return "";
  }
};

// piece promotion tag maps
export type PiecePromotionMap = {
  white: string[];
  black: string[];
};

export const piecePromotionMap: PiecePromotionMap = {
  white: ["N", "B", "R", "Q"],
  black: ["n", "b", "r", "q"],
};
//*/
