// friendship controller dtos

import { EloDto } from "./dtos";

export type GetAllFriendsByStatusDto = {
  freindshpId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: EloDto;
  isRequestor: boolean;
};

export type GetAllNonFriendsDto = {
  userId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: EloDto;
};
