// game controller dtos

import { Guid } from "guid-typescript";
import { TimingTypeModel } from "./abstracDtosAndModels";
import { PieceColor, TimingType } from "../enums/entitiesEnums";

export type CheckIfInGameDto = {
  isInGame: boolean;
  gameId: Guid | null;
};

export type CreatePrivateGameDto = {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

export type EndGameDto = {
  winnerColor: PieceColor | null;
  eloGained: number;
};

export type FetchTimeDto = {
  whiteTimeLeft: number;
  blackTimeLeft: number;
};

export type GetEndedGameDto = {
  winnerColor: PieceColor | null;
};

export type GetFinishedGamesDto = {
  position: string;
  turn: number;
  moves: number;
  isWinner: boolean | null;
  eloGained: number;
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
  color: PieceColor;
};

export type GetTypeHistoryDto = {
  whitePlayer: string;
  blackPlayer: string;
  moves: number;
  isWinner: boolean | null;
  prevElo: number;
  createdAt: Date;
};

export type InvitedToGameDto = TimingTypeModel & {
  gameId: Guid;
  inviteeId: Guid;
  inviterId: Guid;
  inviter: string;
};

export type SearchGameDto = {
  playerId: Guid;
  timingId: Guid;
};

export type CreateGameByEmailDto = {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

export type GetAllInvitationsDto = {
  gameId: Guid;
  inviteeId: Guid;
  invitorId: Guid;
  invitorName: string;
  inviteeName: string;
  createdAt: Date;
  type: TimingType;
};
