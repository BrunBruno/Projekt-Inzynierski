// friendship controller models

import { PagedRequest } from "./commonTypes";

export type GetAllFriendsByStatusModel = PagedRequest & {
  username: string | null;
  status: number;
};

export type GetAllNonFriendsModel = PagedRequest & {
  username: string | null;
};

export type InviteFriendModel = {
  receiverId: string;
};

export type RespondToFriendRequestModel = {
  friendshipId: string;
  isAccepted: boolean;
};
