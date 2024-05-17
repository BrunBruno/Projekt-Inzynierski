// game controller dtos

export type SearchGameDto = {
  playerId: string;
  timingId: string;
};

export type CheckIfInGameDto = {
  isInGame: boolean;
  gameId: string | null;
};

export type GetGameDto = {
  hasEnded: boolean;
  position: string;
  turn: number;
  createdAt: Date;
  duration: number;
  increment: number;
  enPassant: string | null;
  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;
  whitePlayer: GetGamePlayerDto;
  blackPlayer: GetGamePlayerDto;
  moves: GetGameMoveDto[];
};

export type GetGamePlayerDto = {
  name: string;
  imageUrl: string | null;
  elo: number;
};

export type GetGameMoveDto = {
  move: string;
  turn: number;
  oldCoor: string;
  newCoor: string;
  capturedPiece: string;
};

export type GetPlayerDto = {
  name: string;
  elo: number;
  color: number | null;
};

export type EndGameDto = {
  winner: number | null;
};
