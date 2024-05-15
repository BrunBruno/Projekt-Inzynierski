type MovementMap = {
  knightMoves: number[][];
  bishopMoves: number[][];
  rookMoves: number[][];
  queenMoves: number[][];
  kingMoves: number[][];
};

// pieces movement directions lists
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
