/* enums for changing page content based on user selection */

import { TimingTypeModel } from "../types/abstractDtosAndModels";
import { PopupType } from "../types/commonTypes";

// to distinguish different type of content it main page
export enum GameSearchInterface {
  default,
  vsPlayer,
  vsComputer,
  vsFriend,
  searching,
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
  timing?: TimingTypeModel;
};
