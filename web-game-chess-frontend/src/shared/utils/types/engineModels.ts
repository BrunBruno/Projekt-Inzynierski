import { Guid } from "guid-typescript";
import { TimingTypeModel } from "./abstractDtosAndModels";

export type GetEngineGameModel = {
  gameId: Guid;
};

export type MakeMovesModel = {
  gameId: Guid;
  position: string;
  move: string;
};

export type StartEngineGameModel = TimingTypeModel & {};
