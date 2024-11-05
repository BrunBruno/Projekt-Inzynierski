/* engine controller models */

import { Guid } from "guid-typescript";
import { TimingTypeModel } from "./abstractDtosAndModels";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { PieceColor } from "../objects/entitiesEnums";

export type GetEngineGameModel = {
  gameId: Guid;
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

export type StartEngineGameModel = TimingTypeModel & {};

export type EndEngineGameModel = {
  gameId: Guid;
  loserColor: PieceColor | null;
};
