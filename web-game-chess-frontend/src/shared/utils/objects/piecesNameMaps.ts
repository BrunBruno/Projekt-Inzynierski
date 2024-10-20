/* maps for kinds of pieces */

import { BlackPieceTag, PieceName, PieceTag, SideColor, WhitePieceTag } from "./constantLists";

const pieceTagToName = { p: "Pawn", n: "Knight", b: "Bishop", r: "Rook", q: "Queen", k: "King" } as const;

// to game piece name by piece tag
export const getPieceName = (char: PieceTag): string => {
  return pieceTagToName[char.toLowerCase() as PieceTag] || "Unknown";
};

export type PieceTagMap = {
  white: {
    [key in PieceName]: WhitePieceTag;
  };
  black: {
    [key in PieceName]: BlackPieceTag;
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
} as const;

export type WhitePieceType = (typeof pieceTagMap.white)[keyof typeof pieceTagMap.white];
export type BlackPieceType = (typeof pieceTagMap.black)[keyof typeof pieceTagMap.black];

// piece promotion tag maps
export type PiecePromotionMap = {
  white: WhitePieceTag[];
  black: BlackPieceTag[];
};

export const piecePromotionMap: PiecePromotionMap = {
  white: ["N", "B", "R", "Q"],
  black: ["n", "b", "r", "q"],
};
//*/

// to gat side color name by piece tag
export function getPieceSideColor(tag: PieceTag): SideColor | undefined {
  if (tag === tag.toUpperCase()) {
    return "white";
  } else if (tag === tag.toLowerCase()) {
    return "black";
  } else {
    return undefined;
  }
}
