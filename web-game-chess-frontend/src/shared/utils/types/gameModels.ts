// game controller models to requests

export type AbortSearchModel = {
  playerId: string;
};

export type CheckIfInGameModel = {
  playerId: string;
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

export type SearchGameModel = {
  type: number;
  minutes: number;
  increment: number;
};
