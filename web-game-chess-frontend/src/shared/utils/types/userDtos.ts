/* user controller dtos */

import { Guid } from "guid-typescript";
import { EloDto, UserDto, GameOutcomeDto } from "./abstractDtosAndModels";

export type GetRegisterConfDto = {
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

export type GetUserDto = UserDto & {
  userId: Guid;
  email: string;
};

export type IsEmailVerifiedDto = {
  isEmailVerified: boolean;
};

export type GetEloDto = EloDto & {};

export type GetFullUserDto = UserDto & {
  email: string;
  joinDate: Date;
  bio: string | null;
  outcomeTotal: GameOutcomeDto;
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

export type GetOtherUserDto = UserDto & {
  joinDate: Date;
  bio: string | null;
  gamesPlayed: number;
  elo: EloDto;
};
