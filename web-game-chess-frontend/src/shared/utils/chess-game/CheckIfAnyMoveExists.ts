import { GameStates, SelectionStates } from "../types/gameStates";
import { checkIfOwnPiece } from "../functions/gameRelated";
import FindMoves from "./FindMoves";

// to check for checkmates and stalemates
export const checkIfAnyMoveExists = (
  gameState: GameStates,
  selectionState: SelectionStates
): boolean => {
  let moveNotExists: boolean = true;

  // go through all pieces in board to check if checkmate or stalemate
  for (let row in gameState.matrix) {
    for (let col in gameState.matrix[row]) {
      const piece = gameState.matrix[row][col];

      if (checkIfOwnPiece(piece, gameState.playerData!)) {
        const coor = [parseInt(col) + 1, parseInt(row) + 1];

        const availableAreas = FindMoves.find(
          gameState,
          selectionState,
          piece,
          coor
        );

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
