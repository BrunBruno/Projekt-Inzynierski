// friendship controller dtos

import { EloDto } from "./commonTypes";

export type GetAllFriendsByStatusDto = {
  freindshpId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  country: string;
  elo: EloDto;
  isRequestor: boolean;
  gamesPlayed: number;
  wins: number;
  loses: number;
  draws: number;
};

export type GetAllNonFriendsDto = {
  userId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  country: string;
  elo: EloDto;
};

export type GetFriendProfileDto = {
  username: string;
  name: string | null;
  imageUrl: string | null;
  bio: string | null;
  country: string;
  joinDate: Date;
  friendsSince: Date | null;

  requestorWins: number;
  requestorLoses: number;
  requestorDraws: number;
  gamesPlayed: number;
  gamesPlayedTogether: number;
  elo: EloDto;
};
