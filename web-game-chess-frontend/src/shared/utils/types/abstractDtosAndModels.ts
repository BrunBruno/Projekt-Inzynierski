/* abstract types of dtos and models */

import {
  AppearanceOfBoard,
  AppearanceOfGamePage,
  AppearanceOfPieces,
  PieceColor,
  TimingType,
} from "../objects/entitiesEnums";

// pagination result type
export type PagedResult<T> = {
  items: T[];
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
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
  pageNumber: number;
  pageSize: number;
};

// most comment user data dto
export type UserDto = {
  username: string;
  name: string | null;
  backgroundImage: UserImage | null;
  profilePicture: UserImage | null;
  country: string;
};

// general timing type model
export type TimingTypeModel = {
  type: TimingType;
  minutes: number;
  increment: number;
};

// game results representation
export type GameOutcomeDto = {
  total: number;
  wins: number;
  draws: number;
  loses: number;
};

// general player dto
export type PlayerDto = {
  name: string;
  profilePicture: UserImage | null;
  elo: number;
  color: PieceColor;
};

// general move dto
export type MoveDto = {
  move: string;
  fenMove: string;
  turn: number;
  oldCoor: string;
  newCoor: string;
  capturedPiece: string;
  position: string;
};

// general image dto
export type UserImage = {
  data: Uint8Array;
  contentType: string;
};

// general user settings dto
export type GameSettingsDto = {
  appearanceOfPieces: AppearanceOfPieces;
  appearanceOfBoard: AppearanceOfBoard;
  appearanceOfGamePage: AppearanceOfGamePage;
};
