/* game controller models to requests */

import { EndGameTypes, PieceColor, TimingTypes } from "../enums/entitiesEnums";
import { BlackPieceType, WhitePieceType } from "../enums/piecesMaps";
import { PagedModel, TimingTypeModel } from "./abstracDtosAndModels";
import { Guid } from "guid-typescript";

/** POST models */

export type SearchGameModel = TimingTypeModel & {};

export type CreatePrivateGameModel = TimingTypeModel & {
  // freindship id
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
  // piece that was capured or nothing
  capturedPiece: WhitePieceType | BlackPieceType | null;
  // enpassant coordinates if possible
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
  endGameType: EndGameTypes;
};

export type AcceptInvitationModel = {
  // game id of invitation
  gameId: Guid;
  // invitor of game id
  invitorId: Guid;
  // invitee of game id
  inviteeId: Guid;
};

export type UpdatePrivateGameModel = {
  // game id
  gameId: Guid;
};

/** GET models */

export type CheckIfInGameModel = {
  // obtained player di
  playerId: Guid;
};

export type GetAllFinishedGamesModel = PagedModel & {
  // to get only selected types of timing type
  timingTypeFilters: TimingTypes[];
  // to get only selected results of the game
  resultFilters: (boolean | null)[];
};

export type GetTypeHistiryModel = PagedModel & {
  // selected timing to to display history of games
  type: TimingTypes;
};

export type GetAllInvitationsModel = PagedModel;

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
  // plyaer to remove id
  playerId: Guid;
};

export type DeclineInvitationModel = {
  // game to decline id
  gameId: Guid;
  // invitor id
  friendId: Guid;
};
