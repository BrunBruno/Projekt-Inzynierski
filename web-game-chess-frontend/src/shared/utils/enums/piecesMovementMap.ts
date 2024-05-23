type MovementMap = {
  knightMoves: number[][];
  bishopMoves: number[][];
  rookMoves: number[][];
  queenMoves: number[][];
  kingMoves: number[][];
};

// pieces movement directions vectors lists
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

type RankType = {
  pawnStartRank: number;
  pawnDoublePushRank: number;
  enPassantRank: number;
  promotionRank: number;

  backRank: number;
  kingShortFile: number;
  kingLongFile: number;
  shortRookFile: number;
  longtRookFile: number;
};

type RankMap = {
  white: RankType;
  black: RankType;
};

// all special ranks and files
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
    longtRookFile: 1,
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
    longtRookFile: 1,
  },
};
