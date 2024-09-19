/* game controller models to requests */

import { TimingType, PieceColor, GameEndReason } from "../objects/entitiesEnums";
import { BlackPieceType, WhitePieceType } from "../objects/piecesNameMaps";
import { PagedModel, TimingTypeModel } from "./abstractDtosAndModels";
import { Guid } from "guid-typescript";

/** POST models */

export type SearchGameModel = TimingTypeModel & {};

export type CreatePrivateGameModel = TimingTypeModel & {
  // friendship id
  friendshipId: Guid;
};

export type CreateGameByEmailModel = TimingTypeModel & {
  // provided other user emil to invite
  email: string;
};

export type CreateRematchGameModel = TimingTypeModel & {
  // user opponents id from previous game
  opponentId: Guid;
};

export type MakeMoveModel = {
  // game id
  gameId: Guid;
  // current position
  position: string;
  // done move
  move: string;
  // previous coordinates
  oldCoor: string;
  // new coordinates
  newCoor: string;
  // piece that was capered or nothing
  capturedPiece: WhitePieceType | BlackPieceType | null;
  // en passant coordinates if possible
  enPassant: string | null;
  // castling options
  wkm: boolean;
  wsrm: boolean;
  wlrm: boolean;
  bkm: boolean;
  bsrm: boolean;
  blrm: boolean;
};

export type SendMessageModel = {
  // game id where message was sent
  gameId: Guid;
  // message content
  message: string;
};

export type CreateGameWithLinkModel = TimingTypeModel & {};

/** PUT models */

export type EndGameModel = {
  // game id to end
  gameId: Guid;
  // the loser color
  loserColor: PieceColor | null;
  // reason hwy game has ended
  endGameType: GameEndReason;
};

export type AcceptInvitationModel = {
  // game id of invitation
  gameId: Guid;
  // inviter of game id
  inviterId: Guid;
  // invitee of game id
  inviteeId: Guid;
};

/** GET models */

export type CheckIfInGameModel = {
  // obtained player di
  playerId: Guid;
};

export type GetAllFinishedGamesModel = PagedModel & {
  // to get only selected types of timing type
  timingTypeFilters: TimingType[];
  // to get only selected results of the game
  resultFilters: (boolean | null)[];
};

export type GetTypeHistoryModel = PagedModel & {
  // selected timing to to display history of games
  type: TimingType;
};

export type GetAllInvitationsModel = PagedModel & {};

export type NotifyUserModel = TimingTypeModel & {
  // friend to notify id
  friendId: Guid;
  // game to invite id
  gameId: Guid;
  // who is inviting
  inviter: string;
};

/** DELETE models */

export type AbortSearchModel = {
  // player to remove id
  playerId: Guid;
};

export type DeclineInvitationModel = {
  // game to decline id
  gameId: Guid;
  // inviter id
  friendId: Guid;
};

export type TypingStatusModel = {
  // game id
  gameId: Guid;
  // typing status
  isTyping: boolean;
};
