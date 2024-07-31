// abstract types of dtos and models

import { TimingType } from "../enums/entitiesEnums";

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
  imageUrl: string | null;
  country: string;
};

// general timing type model
export type TimingTypeModel = {
  type: TimingType;
  minutes: number;
  increment: number;
};

// game results representation
export type WinDrawLose = {
  total: number;
  wins: number;
  draws: number;
  loses: number;
};
