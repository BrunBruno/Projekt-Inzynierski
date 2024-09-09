/* piece movement ralted options */

// pieces movement directions vectors lists
type MovementMap = {
  knightMoves: number[][];
  bishopMoves: number[][];
  rookMoves: number[][];
  queenMoves: number[][];
  kingMoves: number[][];
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
//*/

// all special ranks and files
type RankType = {
  pawnStartRank: number;
  pawnDoublePushRank: number;
  enPassantRank: number;
  promotionRank: number;
  backRank: number;
  kingShortFile: number;
  kingLongFile: number;
  shortRookFile: number;
  longRookFile: number;
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
    promotionRank: 0,
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
    promotionRank: 0,
    backRank: 8,
    kingShortFile: 7,
    kingLongFile: 3,
    shortRookFile: 8,
    longRookFile: 1,
  },
};
//*/
