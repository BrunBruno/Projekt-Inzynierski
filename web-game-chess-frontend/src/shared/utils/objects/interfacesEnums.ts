/* enums for changing page content based on user selection */

import { PopupType } from "../types/commonTypes";
import { GetAllFriendsByStatusDto } from "../types/friendshipDtos";

// to distinguish different type of content it main page
export enum GameSearchInterface {
  defaultView,
  vsPlayerTimeSlection,
  vsPlayerSearching,
  vsComputerTimeSelection,
  vsComputerOptions,
  vsFriendTimeSelection,
  vsFriendsOptions,
  activeGames,
  userGames,
  invitations,
}

// to distinguish registration modals
export enum RegistrationInterface {
  signIn,
  signUp,
  verify,
  reset,
}

// for displaying game board confirmation window
export enum GameActionInterface {
  leave,
  abort,
  resign,
  draw,
}

// use navigate state options
export type StateOptions = {
  popup?: PopupType;
  interface?: GameSearchInterface;
  regOption?: RegistrationInterface;
  path?: string;
  selectedFriend?: GetAllFriendsByStatusDto;
};
