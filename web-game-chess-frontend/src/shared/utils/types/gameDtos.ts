/* game controller dtos */

import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto, TimingTypeModel, UserImage } from "./abstractDtosAndModels";
import { GameEndReason, MessageType, PieceColor, TimingType } from "../objects/entitiesEnums";

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
  eloGain: number;
};

export type FetchTimeDto = {
  turn: number;
  whiteTimeLeft: number;
  blackTimeLeft: number;
};

export type GetEndedGameDto = {
  winnerColor: PieceColor | null;
  eloGain: number;
};

export type GetPlayerDto = PlayerDto & {};

export type GetAllFinishedGamesDto = {
  position: string;
  turn: number;
  moves: number;
  isWinner: boolean | null;
  eloGained: number;
  createdAt: Date;
  timingType: number;
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
  whitePlayer: PlayerDto;
  blackPlayer: PlayerDto;
};

export type GetGameDto = {
  hasEnded: boolean;
  position: string;
  turn: number;
  createdAt: Date;
  duration: number;
  increment: number;
  enPassant: string | null;
  timingType: TimingType;
  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;
  whitePlayer: PlayerDto;
  blackPlayer: PlayerDto;
  moves: MoveDto[];
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

export type CreateGameByEmailDto = {
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

export type CreateGameWithLinkDto = {
  gameId: Guid;
  gameUrl: string;
};

export type CheckIfUpdateRequiredDto = TimingTypeModel & {
  isRequired: boolean;
};

export type GetGameTimingDto = TimingTypeModel & {};

export type GetOpponentDto = {
  opponentId: Guid;
};

export type CreateRematchGameDto = {
  opponentId: Guid;
  gameId: Guid;
};
