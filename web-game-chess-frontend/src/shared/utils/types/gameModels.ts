// game controller models to requests

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

export type GetFinishedGamesModel = {
  pageNumber: number;
  pageSize: number;
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
};

export type SearchGameModel = {
  type: number;
  minutes: number;
  increment: number;
};
