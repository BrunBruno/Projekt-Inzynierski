import { pieceTagMap } from "../enums/piecesMaps";
import { rankMap } from "../enums/piecesMovementMap";
import GameHubService from "../services/GameHubService";
import { MakeMoveModel } from "../types/gameModels";
import { GameStates, SelectionStates } from "../types/gameStates";
import { areCoorEqual, intToChar } from "../functions/gameRelated";

// make move
export const makeMove = (
  gameState: GameStates,
  selectionState: SelectionStates,
  moveToCoordinates: number[],
  promotedPiece: string | null = null
): void => {
  if (!gameState.gameData) return;

  const [newX, newY] = moveToCoordinates;
  const newCoor = newX + "," + newY;

  const [oldX, oldY] = selectionState.coordinates;
  const oldCoor = oldX + "," + oldY;

  const capturedPiece = gameState.matrix[newY - 1][newX - 1];
  const capture = capturedPiece === "" ? "" : "x";
  gameState.matrix[oldY - 1][oldX - 1] = "";
  gameState.matrix[newY - 1][newX - 1] = promotedPiece ? promotedPiece : selectionState.piece;

  // remove enpassanted pawn
  let enPassantCoor: number[] | null = null;
  if (gameState.gameData?.enPassant) {
    enPassantCoor = gameState.gameData.enPassant.split(",").map(Number);

    if (selectionState.piece === pieceTagMap.white.pawn) {
      if (areCoorEqual(enPassantCoor, [newX, newY])) {
        gameState.matrix[newY - 1 - 1][newX - 1] = "";
      }
    }

    if (selectionState.piece === pieceTagMap.black.pawn) {
      if (areCoorEqual(enPassantCoor, [newX, newY])) {
        gameState.matrix[newY - 1 + 1][newX - 1] = "";
      }
    }
  }
  // perform white castling
  if (selectionState.piece === pieceTagMap.white.king && gameState.gameData.canWhiteKingCastle) {
    // short castling
    if (newX === rankMap.white.kingShortFile) {
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.shortRookFile - 1] = "";
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.kingShortFile - 1 - 1] = pieceTagMap.white.rook;
    }
    // long castling
    if (newX === rankMap.white.kingLongFile) {
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.longtRookFile - 1] = "";
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.kingLongFile + 1 - 1] = pieceTagMap.white.rook;
    }
  }

  // perform black castling
  if (selectionState.piece === pieceTagMap.black.king && gameState.gameData.canBlackKingCastle) {
    // short castling
    if (newX === rankMap.black.kingShortFile) {
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.shortRookFile - 1] = "";
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.kingShortFile - 1 - 1] = pieceTagMap.black.rook;
    }
    // long castling
    if (newX === rankMap.black.kingLongFile) {
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.longtRookFile - 1] = "";
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.kingLongFile + 1 - 1] = pieceTagMap.black.rook;
    }
  }

  const newPosition = makeNewPosition(gameState.matrix);

  const move = selectionState.piece + capture + intToChar(newX) + newY;

  // check for white enpassant possibility
  let newEnPassant: string | null = null;
  if (
    selectionState.piece === pieceTagMap.white.pawn &&
    oldY === rankMap.white.pawnStartRank &&
    newY === rankMap.white.pawnDoublePushRank
  ) {
    newEnPassant = newX + "," + rankMap.white.enPassantRank;
  }

  // check for black enpassant possibility
  if (
    selectionState.piece === pieceTagMap.black.pawn &&
    oldY === rankMap.black.pawnStartRank &&
    newY === rankMap.black.pawnDoublePushRank
  ) {
    newEnPassant = newX + "," + rankMap.black.enPassantRank;
  }

  // remove castling posibility when pices moved
  const wkm = selectionState.piece === pieceTagMap.white.king;
  const wsrm =
    selectionState.piece === pieceTagMap.white.rook &&
    areCoorEqual([oldX, oldY], [rankMap.white.shortRookFile, rankMap.white.backRank]);
  const wlrm =
    selectionState.piece === pieceTagMap.white.rook &&
    areCoorEqual([oldX, oldY], [rankMap.white.longtRookFile, rankMap.white.backRank]);

  const bkm = selectionState.piece === pieceTagMap.black.king;
  const bsrm =
    selectionState.piece === pieceTagMap.black.rook &&
    areCoorEqual([oldX, oldY], [rankMap.black.shortRookFile, rankMap.white.backRank]);
  const blrm =
    selectionState.piece === pieceTagMap.black.rook &&
    areCoorEqual([oldX, oldY], [rankMap.black.longtRookFile, rankMap.white.backRank]);

  const makeMoveModel: MakeMoveModel = {
    gameId: gameState.gameId,
    position: newPosition,
    move: move,
    oldCoor: oldCoor,
    newCoor: newCoor,
    capturedPiece: capturedPiece,
    enPassant: newEnPassant,
    wkm: wkm,
    wsrm: wsrm,
    wlrm: wlrm,
    bkm: bkm,
    bsrm: bsrm,
    blrm: blrm,
  };

  GameHubService.MakeMove(makeMoveModel);
};

// update string positio after move was dane
const makeNewPosition = (oldMatrix: string[][]): string => {
  const newMatrix = oldMatrix.reverse();
  let newPosition: string = "";

  for (let row in newMatrix) {
    let emptyCount: number = 0;

    for (let col in newMatrix[row]) {
      const field = newMatrix[row][col];

      if (field === "") {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          newPosition += emptyCount.toString();
          emptyCount = 0;
        }

        newPosition += newMatrix[row][col];
      }
    }

    if (emptyCount > 0) {
      newPosition += emptyCount.toString();
    }

    newPosition += "/";
  }

  newPosition = newPosition.slice(0, -1);

  return newPosition;
};
