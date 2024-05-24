// friendship controller dtos

export type GetAllFriendsByStatusDto = {
  freindshpId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: number;
  isRequestor: boolean;
};

export type GetAllNonFriendsDto = {
  userId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: number;
};
