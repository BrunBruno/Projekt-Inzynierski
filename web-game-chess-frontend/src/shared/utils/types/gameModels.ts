// game controller models to requests

import { EndGameTypes, PieceColor, TimingType } from "../enums/entitiesEnums";
import { BlackPieceType, WhitePieceType } from "../enums/piecesMaps";
import { PagedModel, TimingTypeModel } from "./abstracDtosAndModels";
import { Guid } from "guid-typescript";

export type AbortSearchModel = {
  playerId: Guid;
};

export type AcceptInvitationModel = {
  gameId: Guid;
  invitorId: Guid;
  inviteeId: Guid;
};

export type CheckIfInGameModel = {
  playerId: Guid;
};

export type CreatePrivateGameModel = TimingTypeModel & {
  friendshipId: Guid;
};

export type EndGameModel = {
  gameId: Guid;
  loserColor: PieceColor | null;
  endGameType: EndGameTypes;
};

export type GetFinishedGamesModel = PagedModel & {
  timingTypeFilters: TimingType[];
  resultFilters: (boolean | null)[];
};

export type GetTypeHistiryModel = PagedModel & {
  type: TimingType;
};

export type MakeMoveModel = {
  gameId: Guid;
  position: string;
  move: string;
  oldCoor: string;
  newCoor: string;
  capturedPiece: WhitePieceType | BlackPieceType | null;
  enPassant: string | null;
  wkm: boolean;
  wsrm: boolean;
  wlrm: boolean;
  bkm: boolean;
  bsrm: boolean;
  blrm: boolean;
};

export type NotifyUserModel = TimingTypeModel & {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

export type SearchGameModel = TimingTypeModel;

export type SendMessageModel = {
  gameId: Guid;
  playerId: Guid;
  message: string;
};

export type CreateGameByEmailModel = TimingTypeModel & {
  email: string;
};

export type GetAllInvitationsModel = PagedModel;

export type DeclineInvitationModel = {
  gameId: Guid;
  friendId: Guid;
};
