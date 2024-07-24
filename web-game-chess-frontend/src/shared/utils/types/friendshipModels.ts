// friendship controller models

import { PagedModel } from "./abstracDtosAndModels";

export type GetAllFriendsByStatusModel = PagedModel & {
  username: string | null;
  status: number;
};

export type GetAllNonFriendsModel = PagedModel & {
  username: string | null;
};

export type InviteFriendModel = {
  receiverId: string;
};

export type RespondToFriendRequestModel = {
  friendshipId: string;
  isAccepted: boolean;
};
