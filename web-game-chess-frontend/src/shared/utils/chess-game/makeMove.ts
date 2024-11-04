import axios from "axios";
import { rankMap } from "../objects/piecesMovementMap";
import { pieceTagMap } from "../objects/piecesNameMaps";
import GameHubService from "../services/GameHubService";
import { MakeWebGameMoveModel } from "../types/gameModels";
import { areCoorEqual, intToChar, toCoor } from "./general";
import { Coordinate, EngineGameStates, PieceOption, SelectionStates, TypeOfGame, WebGameStates } from "./gameSates";
import { engineController, getAuthorization } from "../services/ApiService";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { MakeEngineGameMoveModel } from "../types/engineModels";

// make move
export const makeMove = async (
  typeofGame: TypeOfGame,
  gameState: WebGameStates | EngineGameStates,
  selectionState: SelectionStates,
  moveToCoordinates: Coordinate,
  promotedPiece: PieceOption | null = null
): Promise<void> => {
  if (!gameState.gameData || !moveToCoordinates || !selectionState.coordinates) return;

  const [newX, newY] = moveToCoordinates;
  const newCoor = newX + "," + newY;

  console.log("newCoor:", newCoor);

  const [oldX, oldY] = selectionState.coordinates;
  const oldCoor = oldX + "," + oldY;

  console.log("oldCoor:", oldCoor);

  const capturedPiece = gameState.matrix[newY - 1][newX - 1];

  console.log("capturedPiece:", capturedPiece);
  const capture = capturedPiece === "" ? "" : "x";
  gameState.matrix[oldY - 1][oldX - 1] = "";
  gameState.matrix[newY - 1][newX - 1] = promotedPiece ? promotedPiece : selectionState.piece;

  // remove en passant pawn
  let enPassantCoor: number[] | null = null;
  let enPassantFen: string | null = null;
  if (gameState.gameData.enPassant) {
    enPassantCoor = gameState.gameData.enPassant.split(",").map(Number);

    if (selectionState.piece === pieceTagMap.white.pawn) {
      if (areCoorEqual(toCoor(enPassantCoor), [newX, newY])) {
        gameState.matrix[newY - 1 - 1][newX - 1] = "";
        enPassantFen = " e.p.";
      }
    }

    if (selectionState.piece === pieceTagMap.black.pawn) {
      if (areCoorEqual(toCoor(enPassantCoor), [newX, newY])) {
        gameState.matrix[newY - 1 + 1][newX - 1] = "";
        enPassantFen = " e.p.";
      }
    }
  }

  // perform white castling
  let castlingFen: string | null = null;
  if (selectionState.piece === pieceTagMap.white.king && gameState.gameData.canWhiteKingCastle) {
    // short castling
    if (newX === rankMap.white.kingShortFile) {
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.shortRookFile - 1] = "";
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.kingShortFile - 1 - 1] = pieceTagMap.white.rook;
      castlingFen = "O-O";
    }
    // long castling
    if (newX === rankMap.white.kingLongFile) {
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.longRookFile - 1] = "";
      gameState.matrix[rankMap.white.backRank - 1][rankMap.white.kingLongFile + 1 - 1] = pieceTagMap.white.rook;
      castlingFen = "O-O-O";
    }
  }

  // perform black castling
  if (selectionState.piece === pieceTagMap.black.king && gameState.gameData.canBlackKingCastle) {
    // short castling
    if (newX === rankMap.black.kingShortFile) {
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.shortRookFile - 1] = "";
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.kingShortFile - 1 - 1] = pieceTagMap.black.rook;
      castlingFen = "o-o";
    }
    // long castling
    if (newX === rankMap.black.kingLongFile) {
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.longRookFile - 1] = "";
      gameState.matrix[rankMap.black.backRank - 1][rankMap.black.kingLongFile + 1 - 1] = pieceTagMap.black.rook;
      castlingFen = "o-o-o";
    }
  }

  console.log(gameState.matrix);
  const newPosition = makeNewPosition(gameState.matrix);

  const move = selectionState.piece + capture + intToChar(newX) + newY;

  const isPawnMove = selectionState.piece === "p" || selectionState.piece === "P";
  const fenMove = castlingFen
    ? castlingFen
    : `${isPawnMove ? "" : selectionState.piece}${String.fromCharCode(96 + oldX)}${oldY}${capture}${String.fromCharCode(
        96 + newX
      )}${newY}${enPassantFen ? enPassantFen : ""}`;

  console.log("doneMove: ", move);
  console.log("fenMove:", fenMove);
  console.log(newPosition);

  // check for white en passant possibility
  let newEnPassant: string | null = null;
  if (
    selectionState.piece === pieceTagMap.white.pawn &&
    oldY === rankMap.white.pawnStartRank &&
    newY === rankMap.white.pawnDoublePushRank
  ) {
    newEnPassant = newX + "," + rankMap.white.enPassantRank;
  }

  // check for black en passant possibility
  if (
    selectionState.piece === pieceTagMap.black.pawn &&
    oldY === rankMap.black.pawnStartRank &&
    newY === rankMap.black.pawnDoublePushRank
  ) {
    newEnPassant = newX + "," + rankMap.black.enPassantRank;
  }

  //todo
  // remove castling possibility when piece moved
  const whiteKingMoved = selectionState.piece === pieceTagMap.white.king;
  const whiteShortRookMoved =
    selectionState.piece === pieceTagMap.white.rook &&
    areCoorEqual([oldX, oldY], [rankMap.white.shortRookFile, rankMap.white.backRank]);
  const whiteLongRookMoved =
    selectionState.piece === pieceTagMap.white.rook &&
    areCoorEqual([oldX, oldY], [rankMap.white.longRookFile, rankMap.white.backRank]);

  const blackKingMoved = selectionState.piece === pieceTagMap.black.king;
  const blackShortRookMoved =
    selectionState.piece === pieceTagMap.black.rook &&
    areCoorEqual([oldX, oldY], [rankMap.black.shortRookFile, rankMap.white.backRank]);
  const blackLongRookMoved =
    selectionState.piece === pieceTagMap.black.rook &&
    areCoorEqual([oldX, oldY], [rankMap.black.longRookFile, rankMap.white.backRank]);

  switch (typeofGame) {
    case TypeOfGame.web: {
      const model: MakeWebGameMoveModel = {
        gameId: gameState.gameId,
        position: newPosition,
        move: move,
        fenMove: fenMove,
        oldCoor: oldCoor,
        newCoor: newCoor,
        capturedPiece: capturedPiece as WhitePieceTag | BlackPieceTag | null,
        enPassant: newEnPassant,
        whiteKingMoved: whiteKingMoved,
        whiteShortRookMoved: whiteShortRookMoved,
        whiteLongRookMoved: whiteLongRookMoved,
        blackKingMoved: blackKingMoved,
        blackShortRookMoved: blackShortRookMoved,
        blackLongRookMoved: blackLongRookMoved,
      };

      await GameHubService.MakeMove(model);

      break;
    }

    case TypeOfGame.engine: {
      const model: MakeEngineGameMoveModel = {
        gameId: gameState.gameId,
        position: newPosition,
        move: move,
        fenMove: fenMove,
        oldCoor: oldCoor,
        newCoor: newCoor,
        capturedPiece: capturedPiece as WhitePieceTag | BlackPieceTag | null,
        enPassant: newEnPassant,
        whiteKingMoved: whiteKingMoved,
        whiteShortRookMoved: whiteShortRookMoved,
        whiteLongRookMoved: whiteLongRookMoved,
        blackKingMoved: blackKingMoved,
        blackShortRookMoved: blackShortRookMoved,
        blackLongRookMoved: blackLongRookMoved,
      };

      await axios.post(engineController.makeEngineGameMove(), model, getAuthorization());

      break;
    }

    default:
      break;
  }
};

// update string position after move was dane
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
