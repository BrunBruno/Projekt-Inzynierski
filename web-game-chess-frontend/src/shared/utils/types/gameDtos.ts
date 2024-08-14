// game controller dtos

import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto, TimingTypeModel } from "./abstracDtosAndModels";
import { PieceColor, TimingType } from "../enums/entitiesEnums";

export type CheckIfInGameDto = {
  // has player be assigned to game
  isInGame: boolean;
  // game id if it was
  gameId: Guid | null;
};

export type CreatePrivateGameDto = {
  // obtained freind id
  friendId: Guid;
  // created game id
  gameId: Guid;
  // invitor name
  inviter: string;
};

export type EndGameDto = {
  // winner of the game
  winnerColor: PieceColor | null;
  // elo gaind or lost
  eloGained: number;
};

export type FetchTimeDto = {
  // turn for player
  turn: number;
  // white player time left
  whiteTimeLeft: number;
  // black player time left
  blackTimeLeft: number;
};

export type GetEndedGameDto = {
  // winner of the game
  winnerColor: PieceColor | null;
};

export type GetPlayerDto = PlayerDto & {
  // color of a player
  color: PieceColor;
};

export type GetAllFinishedGamesDto = {
  // last position
  position: string;
  // number of turns
  turn: number;
  // number of moves
  moves: number;
  // is current user a winner
  isWinner: boolean | null;
  // elo gained or lost
  eloGained: number;
  // creation date of the game
  createdAt: Date;
  // type of game timing
  timingType: number;
  // reasult of the ga,e
  endGameType: number;
  // white payer data
  whitePlayer: PlayerDto;
  // black player data
  blackPlayer: PlayerDto;
};

export type GetGameDto = {
  // has game ended
  hasEnded: boolean;
  // current position
  position: string;
  // current turn
  turn: number;
  // date of creation
  createdAt: Date;
  // duration of all move for one player
  duration: number;
  // time increment after each move
  increment: number;
  // en passant coordinates if possible
  enPassant: string | null;
  // castle options
  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;
  // white player data
  whitePlayer: PlayerDto;
  // black player data
  blackPlayer: PlayerDto;
  // all done moves dureing game
  moves: MoveDto[];
};

export type GetTypeHistoryDto = {
  // white player name
  whitePlayer: string;
  // black player name
  blackPlayer: string;
  // number of done moves
  moves: number;
  // is current user a winner
  isWinner: boolean | null;
  // elo before match
  prevElo: number;
  // date of creation
  createdAt: Date;
};

export type InvitedToGameDto = TimingTypeModel & {
  // game id
  gameId: Guid;
  // invitee user id
  inviteeId: Guid;
  // invitor user id
  inviterId: Guid;
  // invitor username
  inviter: string;
};

export type SearchGameDto = {
  // created player id
  playerId: Guid;
  // created or obtained game timing id
  timingId: Guid;
};

export type CreateGameByEmailDto = {
  // obtained firnd user id
  friendId: Guid;
  // created game id
  gameId: Guid;
  // invitor username
  inviter: string;
};

export type GetAllInvitationsDto = {
  // game if of invitation
  gameId: Guid;
  // invitee user id
  inviteeId: Guid;
  // invitor user id
  invitorId: Guid;
  // invitir username
  invitorName: string;
  // invitee username
  inviteeName: string;
  // date of creation
  createdAt: Date;
  // game timing type for game
  type: TimingType;
};

export type GetAllMessagesDto = {
  message: string;
  senderName: string;
  senderImage: string | null;
  sentAt: Date;
};
