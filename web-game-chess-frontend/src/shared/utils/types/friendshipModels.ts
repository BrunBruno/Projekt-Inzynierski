/* friendship controller models */

import { Guid } from "guid-typescript";
import { FriendshipStatus } from "../objects/entitiesEnums";
import { PagedModel } from "./abstractDtosAndModels";

/** POST models */

export type InviteFriendModel = {
  receiverId: Guid;
};

/** PUT models */

export type RespondToFriendRequestModel = {
  friendshipId: Guid;
  isAccepted: boolean;
};

/** GET models */

export type GetAllNonFriendsModel = PagedModel & {
  username: string | null;
};

export type GetAllFriendsByStatusModel = PagedModel & {
  username: string | null;
  status: FriendshipStatus;
};

/** DELETE models */
