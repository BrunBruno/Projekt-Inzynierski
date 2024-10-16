/* abstract types of dtos and models */

import { TimingType } from "../objects/entitiesEnums";

// pagination result type
export type PagedResult<T> = {
  // page result elements
  items: T[];
  // total page count
  totalPages: number;
  // start page
  itemsFrom: number;
  // end page
  itemsTo: number;
  // total items count
  totalItemsCount: number;
};

// elo dto
export type EloDto = {
  bullet: number;
  blitz: number;
  rapid: number;
  classic: number;
  daily: number;
};

// pagination model
export type PagedModel = {
  // page number
  pageNumber: number;
  // page size
  pageSize: number;
};

// most comment user data dto
export type UserDto = {
  // username
  username: string;
  // full name
  name: string | null;
  // profile picture
  profilePicture: UserImage | null;
  // country where account has been registered
  country: string;
};

// general timing type model
export type TimingTypeModel = {
  // game timing type
  type: TimingType;
  // time for one player
  minutes: number;
  // increment after each move
  increment: number;
};

// game results representation
export type WinDrawLose = {
  // total games played
  total: number;
  // total wins
  wins: number;
  // total draws
  draws: number;
  // total loses
  loses: number;
};

// general player dto
export type PlayerDto = {
  // username from user
  name: string;
  // profile picture
  profilePicture: UserImage | null;
  // elo for current selected type
  elo: number;
  // color of a player
  color: number;
};

// general move dto
export type MoveDto = {
  // done move
  move: string;
  // turn when move was done
  turn: number;
  // previous piece coordinates
  oldCoor: string;
  // new piece coordinates
  newCoor: string;
  // captured piece tag
  capturedPiece: string;
};

export type UserImage = {
  data: Uint8Array;
  contentType: string;
};
