// friendship controller dtos

export type GetAllFriendsByStatusDto = {
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: number;
};

export type GetAllNonFriendsDto = {
  userId: string;
  username: string;
  name: string | null;
  imageUrl: string | null;
  elo: number;
};
