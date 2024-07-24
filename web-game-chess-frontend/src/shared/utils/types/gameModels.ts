// game controller models to requests

import { PagedModel, TimingType } from "./abstracDtosAndModels";

export type AbortSearchModel = {
  playerId: string;
};

export type AcceptInvitationModel = {
  gameId: string;
  invitorId: string;
  inviteeId: string;
};

export type CheckIfInGameModel = {
  playerId: string;
};

export type CreatePrivateGameModel = TimingType & {
  friendshipId: string;
};

export type EndGameModel = {
  gameId: string;
  loserColor: number | null;
  endGameType: number;
};

export type GetFinishedGamesModel = PagedModel & {
  timingTypeFilters: number[];
  resultFilters: (boolean | null)[];
};

export type GetTypeHistiryModel = PagedModel & {
  type: number;
};

export type MakeMoveModel = {
  gameId: string;
  position: string;
  move: string;
  oldCoor: string;
  newCoor: string;
  capturedPiece: string | null;
  enPassant: string | null;
  wkm: boolean;
  wsrm: boolean;
  wlrm: boolean;
  bkm: boolean;
  bsrm: boolean;
  blrm: boolean;
};

export type NotifyUserModel = TimingType & {
  friendId: string;
  gameId: string;
  inviter: string;
};

export type SearchGameModel = TimingType;

export type SendMessageModel = {
  gameId: string;
  playerId: string;
  message: string;
};

export type CreateGameByEmailModel = TimingType & {
  email: string;
};

export type DeclineInvitationModel = {
  gameId: string;
};

export type GetAllInvitationsModel = PagedModel;
