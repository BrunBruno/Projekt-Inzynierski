import { checkIfOwnPiece, toCoor } from "./general";
import FindMoves from "./findMoves";
import { WebGameStates, PieceOption, SelectionStates, EngineGameStates } from "./gameSates";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";

// to check for checkmates and stalemates
export const checkIfAnyMoveExists = (
  gameState: WebGameStates | EngineGameStates,
  selectionState: SelectionStates
): boolean => {
  if (!gameState.playerData) return false;

  let moveNotExists: boolean = true;

  // go through all pieces in board to check if checkmate or stalemate
  for (let row in gameState.matrix) {
    for (let col in gameState.matrix[row]) {
      let piece = gameState.matrix[row][col] as PieceOption;

      if (piece === "") continue;
      piece = piece as WhitePieceTag | BlackPieceTag;

      if (checkIfOwnPiece(piece, gameState.playerData)) {
        const coor = toCoor([parseInt(col) + 1, parseInt(row) + 1]);

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
