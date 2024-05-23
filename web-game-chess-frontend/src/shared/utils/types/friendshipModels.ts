// friendship controller models to requests

export type GetAllFriendsByStatusModel = {
  status: number;
  pageNumber: number;
  pageSize: number;
};

export type GetAllNonFriendsModel = {
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
