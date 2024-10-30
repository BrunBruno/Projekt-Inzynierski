/* game controller models to requests */

import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { TimingType, PieceColor, GameEndReason } from "../objects/entitiesEnums";
import { PagedModel, TimingTypeModel } from "./abstractDtosAndModels";
import { Guid } from "guid-typescript";

/** POST models */

export type SearchGameModel = TimingTypeModel & {};

export type CreatePrivateGameModel = TimingTypeModel & {
  friendshipId: Guid;
};

export type CreateGameByEmailModel = TimingTypeModel & {
  email: string;
};

export type CreateRematchGameModel = TimingTypeModel & {
  opponentId: Guid;
  previousGameId: Guid;
};

export type MakeMoveModel = {
  gameId: Guid;
  position: string;
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

export type SendMessageModel = {
  gameId: Guid;
  message: string;
};

export type SendGameMessageModel = {
  gameId: Guid;
  message: string;
};

export type CreateGameWithLinkModel = TimingTypeModel & {};

/** PUT models */

export type EndGameModel = {
  gameId: Guid;
  loserColor: PieceColor | null;
  endGameType: GameEndReason;
};

export type AcceptInvitationModel = {
  gameId: Guid;
  inviterId: Guid;
  inviteeId: Guid;
};

/** GET models */

export type CheckIfInGameModel = {
  playerId: Guid;
};

export type GetAllFinishedGamesModel = PagedModel & {
  timingTypeFilters?: TimingType[];
  resultFilters?: (boolean | null)[];
};

export type GetAllActiveGamesModel = PagedModel & {
  timingTypeFilters?: TimingType[];
};

export type GetTypeHistoryModel = PagedModel & {
  type: TimingType;
};

export type GetAllInvitationsModel = PagedModel & {
  expirationFilters?: boolean[];
};

export type NotifyUserModel = TimingTypeModel & {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

/** DELETE models */

export type AbortSearchModel = {
  playerId: Guid;
};

export type DeclineInvitationModel = {
  gameId: Guid;
  friendId: Guid;
};

export type TypingStatusModel = {
  gameId: Guid;
  isTyping: boolean;
};
