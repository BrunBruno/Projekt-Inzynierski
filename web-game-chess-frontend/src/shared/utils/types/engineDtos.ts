/* engine controller dtos */

import { Guid } from "guid-typescript";
import { GameSettingsDto, MoveDto, PlayerDto } from "./abstractDtosAndModels";
import { MessageType, PieceColor, TimingType } from "../objects/entitiesEnums";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";

export type GetEngineGameDto = {
  position: string;
  turn: number;
  engineLevel: number;
  hasEnded: boolean;
  enPassant: string | null;
  timingType: TimingType | null;
  allowUndo: boolean;
  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;
  player: PlayerDto;
  moves: MoveDto[];
  gameSettings: GameSettingsDto;
};

export type StartEngineGameDto = {
  gameId: Guid;
};

export type GetEngineGameMoveDto = {
  shouldEnd: boolean;
  oldCoordinates: string;
  newCoordinates: string;
  promotedPiece: WhitePieceTag | BlackPieceTag | null;
};

export type EndEngineGameDto = {
  winnerColor: PieceColor | null;
};

export type GetAllEngineGameMessagesDto = {
  message: string;
  senderName: string;
  sentAt: Date;
  type: MessageType;
};
