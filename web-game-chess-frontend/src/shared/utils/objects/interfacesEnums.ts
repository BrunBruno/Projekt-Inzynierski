/* enums for changing page content based on user selection */

import { PopupType } from "../types/commonTypes";
import { GetAllFriendsByStatusDto } from "../types/friendshipDtos";

// to distinguish different type of content it main page
export enum GameSearchInterface {
  defaultView,
  vsPlayerTimeSelection,
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
  signIn = 1,
  signUp = 2,
  verify = 3,
  reset = 4,
}

// for displaying game board confirmation window
export enum GameActionInterface {
  leave = 1,
  abort = 2,
  resign = 3,
  draw = 4,
}

// for displaying game window
export enum GameWindowInterface {
  none,
  confirm,
  winner,
  promotion,
  search,
  engine,
  settings,
}

export enum AccountPageInterface {
  settings,
  friends,
  history,
}

// use navigate state options
export type StateOptions = {
  popup?: PopupType;
  interface?: GameSearchInterface;
  regOption?: RegistrationInterface;
  path?: string;
  selectedFriend?: GetAllFriendsByStatusDto;
};
