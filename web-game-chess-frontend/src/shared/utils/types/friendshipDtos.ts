// friendship controller dtos

import { EloDto, UserDto } from "./abstracDtosAndModels";

export type GetAllFriendsByStatusDto = UserDto & {
  freindshpId: string;
  elo: EloDto;
  isRequestor: boolean;
  gamesPlayed: number;
  wins: number;
  loses: number;
  draws: number;
};

export type GetAllNonFriendsDto = UserDto & {
  userId: string;
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
