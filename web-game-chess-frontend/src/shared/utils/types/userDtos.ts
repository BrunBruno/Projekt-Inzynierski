// user controller dtos

import { Guid } from "guid-typescript";
import { EloDto, UserDto, WinDrawLose } from "./abstracDtosAndModels";

export type ConfigurationDto = {
  // minimal length of input
  minLength: number | null;
  // maximal length of input
  maxLength: number | null;
  // is uppercase letter required in input
  requireUppercase: boolean;
  // is lowercase letter required in input
  requireLowercase: boolean;
  // is digit required in input
  requireDigit: boolean;
  // is special char required in input
  requireSpecialChar: boolean;
};

export type LogInUserDto = {
  // jwt token
  token: string;
};

export type GetUserDto = UserDto & {
  // users id
  userId: Guid;
  // users email
  email: string;
};

export type IsEmailVerifiedDto = {
  // is email verified using verification code
  isEmailVerified: boolean;
};

export type GetEloDto = EloDto;

export type GetFullUserDto = UserDto & {
  // user email
  email: string;
  // date of account creation
  joinDate: Date;
  // description/biography
  bio: string | null;
  // wins, loses and draws in total
  wdlTotal: WinDrawLose;
  // reasons of wins and loses
  winsByCheckMate: number;
  winsByTimeout: number;
  winsByResignation: number;
  losesByCheckMate: number;
  losesByTimeout: number;
  losesByResignation: number;
};

export type GetByEmailDto = {
  // email
  email: string;
  // username
  userName: string;
};

export type GetOtherUserDto = UserDto & {
  // date of creation
  joinDate: Date;
  // desciption
  bio: string | null;
  // total games played
  gamesPlayed: number;
};
