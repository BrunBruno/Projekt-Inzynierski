/* enums for changing page content based on user selection */

import { PopupType } from "../types/commonTypes";
import { GetAllFriendsByStatusDto } from "../types/friendshipDtos";

// to distinguish different type of content it main page
export enum GameSearchInterface {
  defaultView,
  vsPlayerTimeSelection,
  vsPlayerSearching,
  vsComputerOptions,
  vsFriendTimeSelection,
  vsFriendsOptions,
  vsFriendSearching,
  activeGames,
  finishedGames,
  engineGames,
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
  leave = 1,
  abort = 2,
  resign = 3,
  draw = 4,
  block = 5,
  report = 6,
  restart = 7,
}

// for displaying game window
export enum GameWindowInterface {
  none,
  confirm,
  winner,
  inspect,
  promotion,
  search,
  engine,
  settings,
  history,
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
