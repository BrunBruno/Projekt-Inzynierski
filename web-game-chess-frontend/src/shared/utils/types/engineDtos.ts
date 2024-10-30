/* engine controller dtos */

import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto } from "./abstractDtosAndModels";
import { TimingType } from "../objects/entitiesEnums";

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

export type MakeMovesDto = {
  newPosition: string;
  turn: number;
  outputs: string[];
};

export type StartEngineGameDto = {
  gameId: Guid;
};
