import { CastleOptions } from "../../../../shared/utils/types/commonTypes";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import { checkIfOwnPiece } from "./ExtraFunctions";
import ShowTip from "./ShowTip";

export const checkCheckMate = (
  player: GetPlayerDto,
  matrix: string[][],
  whiteAreas: number[][],
  blackAreas: number[][],
  whiteChecks: number[][],
  blackChecks: number[][],
  enPassant: string | null,
  castleOptions: CastleOptions | null
): boolean => {
  let isCheckMate: boolean = true;
  for (let row in matrix) {
    for (let col in matrix[row]) {
      const piece = matrix[row][col];

      if (checkIfOwnPiece(piece, player)) {
        const xCoor = parseInt(col) + 1;
        const yCoor = parseInt(row) + 1;
        const coor = [xCoor, yCoor];
        const tips = ShowTip.showTip(
          player,
          matrix,
          whiteAreas,
          blackAreas,
          coor,
          piece,
          whiteChecks,
          blackChecks,
          enPassant,
          castleOptions
        );

        if (tips.length > 1) {
          isCheckMate = false;
          break;
        }
      }
    }

    if (!isCheckMate) {
      break;
    }
  }

  return isCheckMate;
};
