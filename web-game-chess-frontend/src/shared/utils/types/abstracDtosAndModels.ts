// abstract types of dtos and models

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

export type TimingType = {
  type: number;
  minutes: number;
  increment: number;
};
