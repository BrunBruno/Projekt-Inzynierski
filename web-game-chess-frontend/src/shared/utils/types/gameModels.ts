export type SearchGameModel = {
  type: number;
  minutes: number;
  increment: number;
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

export type EndGameModel = {
  gameId: string;
  loserColor: number;
};
