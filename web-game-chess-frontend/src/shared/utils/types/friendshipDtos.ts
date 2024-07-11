// friendship controller dtos

import { EloDto } from "./dtos";

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
  elo: EloDto;
};
