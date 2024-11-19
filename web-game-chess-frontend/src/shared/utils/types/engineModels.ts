/* engine controller models */

import { Guid } from "guid-typescript";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { PieceColor } from "../objects/entitiesEnums";

/** POST models */

export type StartEngineGameModel = {
  engineLevel: number;
};

export type MakeEngineGameMoveModel = {
  gameId: Guid;
  position: string;
  fenMove: string;
  move: string;
  oldCoor: string;
  newCoor: string;
  capturedPiece: WhitePieceTag | BlackPieceTag | null;
  enPassant: string | null;
  whiteKingMoved: boolean;
  whiteShortRookMoved: boolean;
  whiteLongRookMoved: boolean;
  blackKingMoved: boolean;
  blackShortRookMoved: boolean;
  blackLongRookMoved: boolean;
};

/** PUT models */

export type EndEngineGameModel = {
  gameId: Guid;
  loserColor: PieceColor | null;
};

export type UndoMoveModel = {
  gameId: Guid;
};

export type ChangeEngineLevelModel = {
  gameId: Guid;
  level: number;
};

/** GET models */

/** DELETE models */
