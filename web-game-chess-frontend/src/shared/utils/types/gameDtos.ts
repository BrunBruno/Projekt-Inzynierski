export type SearchGameDto = {
  playerId: string;
  timingId: string;
};

export type CheckIfInGameDto = {
  isInGame: boolean;
  gameId: string | null;
};

export type GetGameDto = {
  position: string;
  turn: number;
  createdAt: Date;
  duration: number;
  increment: number;
  whitePlayer: GetGamePlayerDto;
  blackPlayer: GetGamePlayerDto;
  moves: GetGameMoveDto[];
};

export type GetGamePlayerDto = {
  name: string;
  elo: number;
};

export type GetGameMoveDto = {
  move: string;
  turn: number;
};

export type GetPlayerDto = {
  name: string;
  elo: number;
  color: number | null;
};
