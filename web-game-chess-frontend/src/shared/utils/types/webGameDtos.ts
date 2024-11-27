/* game controller dtos */

import { Guid } from "guid-typescript";
import { GameSettingsDto, MoveDto, PlayerDto, TimingTypeModel, UserImage } from "./abstractDtosAndModels";
import { GameEndReason, MessageType, PieceColor, TimingType } from "../objects/entitiesEnums";

export type CheckIfInWebGameDto = {
  isInGame: boolean;
  gameId: Guid | null;
};

export type CreatePrivateGameDto = {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

export type GetWinnerDto = {
  winnerColor: PieceColor | null;
  eloGain: number;
};

export type FetchTimeDto = {
  turn: number;
  whiteTimeLeft: number;
  blackTimeLeft: number;
};

export type GetWebGamePlayerDto = PlayerDto & {};

export type GetAllFinishedGamesDto = {
  gameId: Guid;
  position: string;
  turn: number;
  moves: number;
  isWinner: boolean | null;
  eloGained: number;
  createdAt: Date;
  timingType: TimingType;
  endGameType: GameEndReason;
  whitePlayer: PlayerDto;
  blackPlayer: PlayerDto;
};

export type GetAllActiveGamesDto = {
  gameId: Guid;
  position: string;
  turn: number;
  moves: number;
  createdAt: Date;
  timingType: TimingType;
  timeLeft: number;
  whitePlayer: PlayerDto;
  blackPlayer: PlayerDto;
};

export type GetWebGameDto = {
  hasEnded: boolean;
  position: string;
  turn: number;
  createdAt: Date;
  duration: number;
  increment: number;
  enPassant: string | null;
  timingType: TimingType;
  halfmoveClock: number;

  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;

  whitePlayer: PlayerDto;
  blackPlayer: PlayerDto;
  moves: MoveDto[];
  gameSettings: GameSettingsDto;
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

export type SearchWebGameDto = {
  playerId: Guid;
  timingId: Guid;
};

export type CreatePrivateGameByEmailDto = {
  friendId: Guid;
  gameId: Guid;
  inviter: string;
};

export type GetAllInvitationsDto = {
  gameId: Guid;
  inviteeId: Guid;
  inviterId: Guid;
  inviterName: string;
  inviteeName: string;
  createdAt: Date;
  type: TimingType;
};

export type GetAllMessagesDto = {
  message: string;
  senderName: string;
  senderImage: UserImage | null;
  sentAt: Date;
  type: MessageType;
  requestorName: string | null;
};

export type CreatePrivateGameWithLinkDto = {
  gameId: Guid;
  gameUrl: string;
};

export type CheckIfUpdateOnPrivateGameRequiredDto = TimingTypeModel & {
  isRequired: boolean;
};

export type GetGameTimingDto = TimingTypeModel & {};

export type GetOpponentDto = {
  opponentId: Guid;
};

export type CreateWebGameRematchDto = {
  gameId: Guid;
  opponentName: string;
};

export type GetTotalGamesStatsDto = {
  gamesPlayed: number;
  usersJoined: number;
};

/** Not used */

export type AcceptWebGameRematchDto = {
  whitePlayerUserId: Guid;
  blackPlayerUserId: Guid;
};

export type UpdatePrivateGameDto = {
  shouldStart: boolean;
  whitePlayerUserId: Guid;
  blackPlayerUserId: Guid;
};
