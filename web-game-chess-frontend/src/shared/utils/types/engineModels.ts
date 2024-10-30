/* engine controller models */

import { Guid } from "guid-typescript";
import { TimingTypeModel } from "./abstractDtosAndModels";

export type GetEngineGameModel = {
  gameId: Guid;
};

export type MakeEngineGameMovesModel = {
  gameId: Guid;
  position: string;
  move: string;
};

export type StartEngineGameModel = TimingTypeModel & {};
