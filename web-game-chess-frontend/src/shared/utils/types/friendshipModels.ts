// friendship controller models to requests

export type GetAllFriendsByStatusModel = {
  username: string | null;
  status: number;
  pageNumber: number;
  pageSize: number;
};

export type GetAllNonFriendsModel = {
  username: string | null;
  pageNumber: number;
  pageSize: number;
};

export type InviteFriendModel = {
  receiverId: string;
};

export type RespondToFriendRequestModel = {
  friendshipId: string;
  isAccepted: boolean;
};
