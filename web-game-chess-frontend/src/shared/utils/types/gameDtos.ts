// game controller dtos

import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto, TimingTypeModel, UserImage } from "./abstractDtosAndModels";
import { GameEndReason, MessageType, PieceColor, TimingType } from "../objects/entitiesEnums";

export type CheckIfInGameDto = {
  // has player be assigned to game
  isInGame: boolean;
  // game id if it was
  gameId: Guid | null;
};

export type CreatePrivateGameDto = {
  // obtained friend id
  friendId: Guid;
  // created game id
  gameId: Guid;
  // inviter name
  inviter: string;
};

export type EndGameDto = {
  // winner of the game
  winnerColor: PieceColor | null;
  // elo gained or lost
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
  // result of the ga,e
  endGameType: GameEndReason;
  // white payer data
  whitePlayer: PlayerDto;
  // black player data
  blackPlayer: PlayerDto;
};

export type GetAllActiveGamesDto = {
  // last position
  position: string;
  // number of turns
  turn: number;
  // number of moves
  moves: number;
  // creation date of the game
  createdAt: Date;
  // type of game timing
  timingType: TimingType;
  // link for rejoining
  gameUrl: string;
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
  //
  timingType: TimingType;
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
  // all done moves during game
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
  // inviter user id
  inviterId: Guid;
  // inviter username
  inviter: string;
};

export type SearchGameDto = {
  // created player id
  playerId: Guid;
  // created or obtained game timing id
  timingId: Guid;
};

export type CreateGameByEmailDto = {
  // obtained friend user id
  friendId: Guid;
  // created game id
  gameId: Guid;
  // inviter username
  inviter: string;
};

export type GetAllInvitationsDto = {
  // game if of invitation
  gameId: Guid;
  // invitee user id
  inviteeId: Guid;
  // inviter user id
  inviterId: Guid;
  // inviter username
  inviterName: string;
  // invitee username
  inviteeName: string;
  // date of creation
  createdAt: Date;
  // game timing type for game
  type: TimingType;
};

export type GetAllMessagesDto = {
  // message content
  message: string;
  // sender name
  senderName: string;
  // sender profile picture url
  senderImage: UserImage | null;
  // date of message creation
  sentAt: Date;
  // message type
  type: MessageType;
  // requestor name when draw offer
  requestorName: string | null;
};

export type CreateGameWithLinkDto = {
  // game id
  gameId: Guid;
  // obtained url to awaiting page
  gameUrl: string;
};

export type CheckIfUpdateRequiredDto = TimingTypeModel & {
  // is update on players required
  isRequired: boolean;
};

export type GetGameTimingDto = TimingTypeModel & {};

export type GetOpponentDto = {
  // previous opponent id
  opponentId: Guid;
};
