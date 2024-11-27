import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { PieceColor } from "../objects/entitiesEnums";
import { pieceTagMap } from "../objects/piecesNameMaps";
import { MoveDto } from "../types/abstractDtosAndModels";

// check for fifty move rule repetition
export const check50MoveRuleRepetition = (halfmoveClock: number): boolean => {
  return halfmoveClock >= 100;
};

// check for threefold repetition
export const checkThreefoldRepetition = (moves: MoveDto[]): boolean => {
  const positionCount: Record<string, number> = {};

  for (const move of moves) {
    positionCount[move.position] = (positionCount[move.position] || 0) + 1;
  }

  for (const count of Object.values(positionCount)) {
    if (count >= 3) return true;
  }

  return false;
};

// check for insufficient material draw
export const checkMaterialDraw = (moves: MoveDto[]): boolean => {
  if (moves.length === 0) return false;

  const lastMove = moves[moves.length - 1];
  const lastPosition = lastMove.position;
  const pieceCounts: Record<WhitePieceTag | BlackPieceTag, number> = {
    K: 0,
    Q: 0,
    R: 0,
    B: 0,
    N: 0,
    P: 0,
    k: 0,
    q: 0,
    r: 0,
    b: 0,
    n: 0,
    p: 0,
  };

  // Count all pieces
  for (const char of lastPosition) {
    let piece = char as WhitePieceTag | BlackPieceTag;
    if (pieceCounts[piece] !== undefined) {
      pieceCounts[piece]++;
    }
  }

  const whitePieces =
    pieceCounts[pieceTagMap.white.queen] +
    pieceCounts[pieceTagMap.white.rook] +
    pieceCounts[pieceTagMap.white.bishop] +
    pieceCounts[pieceTagMap.white.knight] +
    pieceCounts[pieceTagMap.white.pawn];

  const blackPieces =
    pieceCounts[pieceTagMap.black.queen] +
    pieceCounts[pieceTagMap.black.rook] +
    pieceCounts[pieceTagMap.black.bishop] +
    pieceCounts[pieceTagMap.black.knight] +
    pieceCounts[pieceTagMap.black.pawn];

  const whiteMinorPieces = pieceCounts[pieceTagMap.white.bishop] + pieceCounts[pieceTagMap.white.knight];
  const blackMinorPieces = pieceCounts[pieceTagMap.black.bishop] + pieceCounts[pieceTagMap.black.knight];

  const whiteHasBishopsSameColor = areBishopsOnSameColorSquares(lastPosition, PieceColor.white);
  const blackHasBishopsSameColor = areBishopsOnSameColorSquares(lastPosition, PieceColor.black);

  // cases for material draw
  // king only || king + minor || king + 2 same bishops
  const isWhiteDraw =
    whitePieces === 0 ||
    (whiteMinorPieces === 1 && whitePieces === 1) ||
    (whiteMinorPieces === 2 && whitePieces === 2 && !pieceCounts[pieceTagMap.white.knight] && whiteHasBishopsSameColor);

  const isBlackDraw =
    blackPieces === 0 ||
    (blackMinorPieces === 1 && blackPieces === 1) ||
    (blackMinorPieces === 2 && blackPieces === 2 && !pieceCounts[pieceTagMap.black.knight] && blackHasBishopsSameColor);

  console.log(whiteHasBishopsSameColor);
  console.log(blackHasBishopsSameColor);

  return isWhiteDraw && isBlackDraw;
};

// bishop color detection
const areBishopsOnSameColorSquares = (position: string, color: PieceColor): boolean => {
  const rows = position.split("/");

  const bishopPositions: { color: PieceColor; squareColor: string }[] = [];

  for (let rank = 0; rank < rows.length; rank++) {
    let fileIndex = 0;
    for (const char of rows[rank]) {
      if (isNaN(parseInt(char))) {
        if (char === "B" || char === "b") {
          const squareColor = (rank + fileIndex) % 2 === 0 ? "dark" : "light";
          bishopPositions.push({ color: char === "B" ? PieceColor.white : PieceColor.black, squareColor });
        }
        fileIndex++;
      } else {
        fileIndex += parseInt(char);
      }
    }
  }

  const squareColors = bishopPositions.filter((bp) => bp.color === color).map((bp) => bp.squareColor);
  return new Set(squareColors).size === 1;
};
