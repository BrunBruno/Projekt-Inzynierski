/* piece movement related options */

import { NMatrix } from "../types/commonTypes";

// pieces movement directions vectors lists
type MovementMap = {
  knightMoves: NMatrix;
  bishopMoves: NMatrix;
  rookMoves: NMatrix;
  queenMoves: NMatrix;
  kingMoves: NMatrix;
};

export const movementMap: MovementMap = {
  knightMoves: [
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
  ],
  bishopMoves: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
  rookMoves: [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ],
  queenMoves: [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
  kingMoves: [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
};

// all special ranks and files
type RankType = {
  // ranks
  pawnStartRank: 2 | 7;
  pawnDoublePushRank: 4 | 5;
  enPassantRank: 3 | 6;
  promotionRank: 8 | 1;
  backRank: 1 | 8;
  // files
  kingShortFile: 7;
  kingLongFile: 3;
  shortRookFile: 8;
  longRookFile: 1;
};

type RankMap = {
  white: RankType;
  black: RankType;
};

export const rankMap: RankMap = {
  white: {
    pawnStartRank: 2,
    pawnDoublePushRank: 4,
    enPassantRank: 3,
    promotionRank: 8,
    backRank: 1,
    kingShortFile: 7,
    kingLongFile: 3,
    shortRookFile: 8,
    longRookFile: 1,
  },

  black: {
    pawnStartRank: 7,
    pawnDoublePushRank: 5,
    enPassantRank: 6,
    promotionRank: 1,
    backRank: 8,
    kingShortFile: 7,
    kingLongFile: 3,
    shortRookFile: 8,
    longRookFile: 1,
  },
};
