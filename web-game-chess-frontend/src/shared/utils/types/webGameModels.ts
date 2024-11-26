/* game controller models to requests */

import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";
import { TimingType, PieceColor, GameEndReason } from "../objects/entitiesEnums";
import { PagedModel, TimingTypeModel } from "./abstractDtosAndModels";
import { Guid } from "guid-typescript";

/** POST models */

export type SearchWebGameModel = TimingTypeModel & {};

export type CreatePrivateGameModel = TimingTypeModel & {
  friendshipId: Guid;
};

export type CreatePrivateGameByEmailModel = TimingTypeModel & {
  email: string;
};

export type CreatePrivateGameWithLinkModel = TimingTypeModel & {};

export type CreateWebGameRematchModel = TimingTypeModel & {
  opponentId: Guid;
  previousGameId: Guid;
};

export type MakeWebGameMoveModel = {
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

export type SendPlayerMessageModel = {
  gameId: Guid;
  message: string;
};

export type SendGameMessageModel = {
  gameId: Guid;
  message: string;
};

/** PUT models */

export type EndWebGameModel = {
  gameId: Guid;
  loserColor: PieceColor | null;
  endGameType: GameEndReason | null;
};

export type AcceptInvitationModel = {
  gameId: Guid;
  inviterId: Guid;
  inviteeId: Guid;
};

/** GET models */

export type CheckIfInWebGameModel = {
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
  gameId: Guid;
  friendId: Guid;
  inviter: string;
};

export type TypingStatusModel = {
  gameId: Guid;
  isTyping: boolean;
};

/** DELETE models */

export type AbortWebGameSearchModel = {
  playerId: Guid;
};

export type DeclineInvitationModel = {
  gameId: Guid;
  friendId: Guid;
};

export type CancelWebGameRematchModel = {
  currentGameId: Guid;
  newGameId: Guid;
};
