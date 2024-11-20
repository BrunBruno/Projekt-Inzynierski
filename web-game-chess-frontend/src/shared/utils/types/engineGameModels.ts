/* engine controller models */

import { Guid } from "guid-typescript";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { PieceColor } from "../objects/entitiesEnums";
import { PagedModel } from "./abstractDtosAndModels";

/** POST models */

export type StartEngineGameModel = {
  engineLevel: number;
};

export type MakeEngineGameMoveModel = {
  gameId: Guid;
  position: string;
  move: string;
  fenMove: string;
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

export type GetAllEngineGamesModel = PagedModel & {
  resultFilters?: (boolean | null)[];
};

/** DELETE models */
