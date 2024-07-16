// user controller dtos

import { EloDto } from "./commonTypes";

export type ConfigurationDto = {
  minLength: number | null;
  maxLength: number | null;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
};

export type LogInUserDto = {
  token: string;
};

export type GetUserDto = {
  userId: string;
  email: string;
  userName: string;
  fullName: string | null;
  imageUrl: string | null;
};

export type IsEmailVerifiedDto = {
  isEmailVerified: boolean;
};

export type GetEloDto = EloDto;

export type GetFullUserDto = {
  email: string;
  username: string;
  name: string | null;
  joinDate: Date;
  imageUrl: string | null;
  country: string;
  bio: string | null;
  wins: number;
  loses: number;
  draws: number;
  gamesPlayed: number;
  winsByCheckMate: number;
  winsByTimeout: number;
  winsByResignation: number;
  losesByCheckMate: number;
  losesByTimeout: number;
  losesByResignation: number;
};

export type GetByEmailDto = {
  email: string;
  userName: string;
};
