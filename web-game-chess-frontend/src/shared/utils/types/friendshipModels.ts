/* Friendship controller models */

import { Guid } from "guid-typescript";
import { FriendshipStatus } from "../enums/entitiesEnums";
import { PagedModel } from "./abstracDtosAndModels";

/** POST models */

export type InviteFriendModel = {
  // id of user that is being invited
  receiverId: Guid;
};

/** PUT models */

export type RespondToFriendRequestModel = {
  // replay of user to change status of friendship
  isAccepted: boolean;
};

/** GET models */

export type GetAllNonFriendsModel = PagedModel & {
  // usernamre to filter users
  username: string | null;
};

export type GetAllFriendsByStatusModel = PagedModel & {
  // usernamre to filter users
  username: string | null;
  // to get list of one selected type
  status: FriendshipStatus;
};

/** DELETE models */
