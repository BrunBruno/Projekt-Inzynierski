// friendship controller models

import { Guid } from "guid-typescript";
import { FriendshipStatus } from "../enums/entitiesEnums";
import { PagedModel } from "./abstracDtosAndModels";

export type GetAllFriendsByStatusModel = PagedModel & {
  username: string | null;
  status: FriendshipStatus;
};

export type GetAllNonFriendsModel = PagedModel & {
  username: string | null;
};

export type InviteFriendModel = {
  receiverId: Guid;
};

export type RespondToFriendRequestModel = {
  friendshipId: Guid;
  isAccepted: boolean;
};
