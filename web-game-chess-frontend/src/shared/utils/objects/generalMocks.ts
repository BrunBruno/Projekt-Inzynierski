import { Guid } from "guid-typescript";
import { EloDto, WinDrawLose } from "../types/abstractDtosAndModels";
import { MockUser } from "../services/MockJwtService";

export const mockUserForToken: MockUser = {
  id: Guid.create(),
  username: "Username",
  role: {
    name: "user",
  },
  isVerified: false,
};

export const mockElo: EloDto = {
  bullet: 1000,
  blitz: 1000,
  rapid: 1000,
  classic: 1000,
  daily: 1000,
};

export const mockWdl: WinDrawLose = {
  total: 10,
  wins: 5,
  draws: 1,
  loses: 4,
};
