// game controller models to requests

import { PagedRequest } from "./commonTypes";

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

export type CreatePrivateGameModel = {
  friendshipId: string;
  type: number;
  minutes: number;
  increment: number;
};

export type EndGameModel = {
  gameId: string;
  loserColor: number | null;
  endGameType: number;
};

export type GetFinishedGamesModel = PagedRequest & {
  timingTypeFilters: number[];
  resultFilters: (boolean | null)[];
};

export type GetTypeHistiryModel = PagedRequest & {
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

export type NotifyUserModel = {
  friendId: string;
  gameId: string;
  inviter: string;
  type: number;
  minutes: number;
  increment: number;
};

export type SearchGameModel = {
  type: number;
  minutes: number;
  increment: number;
};

export type SendMessageModel = {
  gameId: string;
  playerId: string;
  message: string;
};

export type CreateGameByEmailModel = {
  email: string;
  type: number;
  minutes: number;
  increment: number;
};

export type DeclineInvitationModel = {
  gameId: string;
};

export type GetAllInvitationsModel = PagedRequest;
