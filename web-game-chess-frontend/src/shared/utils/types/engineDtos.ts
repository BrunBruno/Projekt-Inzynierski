/* engine controller dtos */

import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto } from "./abstractDtosAndModels";
import { TimingType } from "../objects/entitiesEnums";
import { BlackPieceTag, WhitePieceTag } from "../objects/constantLists";

export type GetEngineGameDto = {
  position: string;
  turn: number;
  hasEnded: boolean;
  enPassant: string | null;
  timingType: TimingType;
  canWhiteKingCastle: boolean;
  canWhiteShortRookCastle: boolean;
  canWhiteLongRookCastle: boolean;
  canBlackKingCastle: boolean;
  canBlackShortRookCastle: boolean;
  canBlackLongRookCastle: boolean;
  player: PlayerDto;
  moves: MoveDto[];
};

export type StartEngineGameDto = {
  gameId: Guid;
};

export type GetEngineGameMoveDto = {
  oldCoordinates: string;
  newCoordinates: string;
  promotedPiece: WhitePieceTag | BlackPieceTag | null;
};
