/* friendship controller dtos */

import { Guid } from "guid-typescript";
import { EloDto, UserDto, WinDrawLose } from "./abstracDtosAndModels";

export type GetAllFriendsByStatusDto = UserDto & {
  // friendship id
  freindshpId: Guid;
  // elo for all types
  elo: EloDto;
  // is user a requestor of friendship
  isRequestor: boolean;
  // wins, loses and draws in total
  wdlTotal: WinDrawLose;
  // wins, loses and draws in ralationship
  wdlTogether: WinDrawLose;
};

export type GetAllNonFriendsDto = UserDto & {
  // id of user
  userId: Guid;
  // elo for all types
  elo: EloDto;
  // wins, loses and draws in total
  wdlTotal: WinDrawLose;
};

export type GetFriendProfileDto = UserDto & {
  // description\biography
  bio: string | null;
  // when user created account
  joinDate: Date;
  // when firendship was accepted
  friendsSince: Date | null;
  // elo for all types
  elo: EloDto;
  // wins, loses and draws in total
  wdlTotal: WinDrawLose;
  // wins, loses and draws in ralationship
  wdlTogether: WinDrawLose;
};
