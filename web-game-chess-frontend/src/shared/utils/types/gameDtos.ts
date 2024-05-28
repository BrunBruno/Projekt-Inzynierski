// game controller dtos

export type CheckIfInGameDto = {
  isInGame: boolean;
  gameId: string | null;
};

export type CreatePrivateGameDto = {
  friendId: string;
  gameId: string;
  inviter: string;
};

export type EndGameDto = {
  winnerColor: number | null;
};

export type FetchTimeDto = {
  whiteTimeLeft: number;
  blackTimeLeft: number;
};

export type GetEndedGameDto = {
  winnerColor: number | null;
};

export type GetFinishedGamesDto = {
  position: string;
  turn: number;
  moves: number;
  isWinner: boolean | null;
  createdAt: Date;
  timingType: number;
  endGameType: number;
  whitePlayer: GetFinishedGamesPlayerDto;
  blackPlayer: GetFinishedGamesPlayerDto;
};

export type GetFinishedGamesPlayerDto = {
  name: string;
  imageUrl: string | null;
  elo: number;
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
  color: number;
};

export type InvitedToGameDto = {
  gameId: string;
  inviteeId: string;
  inviterId: string;
  inviter: string;
};

export type SearchGameDto = {
  playerId: string;
  timingId: string;
};
