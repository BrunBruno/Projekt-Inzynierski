import { Guid } from "guid-typescript";
import { MoveDto, PlayerDto } from "./abstractDtosAndModels";

export type GetEngineGameDto = {
  position: string;
  turn: number;
  hasEnded: boolean;
  player: PlayerDto;
  moves: MoveDto[];
};

export type MakeMovesDto = {
  newPosition: string;
  turn: number;
};

export type StartEngineGameDto = {
  gameId: Guid;
};
