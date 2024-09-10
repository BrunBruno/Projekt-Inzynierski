import { GameStates, SelectionStates } from "../types/gameStates";
import { checkIfOwnPiece } from "../functions/gameRelated";
import FindMoves from "./FindMoves";

// to check for checkmates and stalemates
export const checkIfAnyMoveExists = (gameState: GameStates, selectionState: SelectionStates): boolean => {
  if (!gameState.playerData) return false;

  let moveNotExists: boolean = true;

  // go through all pieces in board to check if checkmate or stalemate
  for (let row in gameState.matrix) {
    for (let col in gameState.matrix[row]) {
      const piece = gameState.matrix[row][col];

      if (piece === "") continue;

      if (checkIfOwnPiece(piece, gameState.playerData)) {
        const coor = [parseInt(col) + 1, parseInt(row) + 1];

        // check if any possible move exists
        const availableAreas = FindMoves.find(gameState, selectionState, piece, coor);

        // more then 1 to not include piece itself
        if (availableAreas.length > 1) {
          moveNotExists = false;
          break;
        }
      }
    }

    if (!moveNotExists) {
      break;
    }
  }

  return moveNotExists;
};
