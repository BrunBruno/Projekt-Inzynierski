// friendship controller dtos

import { Guid } from "guid-typescript";
import { EloDto, UserDto } from "./abstracDtosAndModels";

export type GetAllFriendsByStatusDto = UserDto & {
  freindshpId: Guid;
  elo: EloDto;
  isRequestor: boolean;
  gamesPlayed: number;
  wins: number;
  loses: number;
  draws: number;
};

export type GetAllNonFriendsDto = UserDto & {
  userId: Guid;
  elo: EloDto;
};

export type GetFriendProfileDto = UserDto & {
  bio: string | null;
  joinDate: Date;
  friendsSince: Date | null;
  requestorWins: number;
  requestorLoses: number;
  requestorDraws: number;
  gamesPlayed: number;
  gamesPlayedTogether: number;
  elo: EloDto;
};
