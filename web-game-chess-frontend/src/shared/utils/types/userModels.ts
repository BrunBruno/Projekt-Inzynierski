// user controller models to requests

import { Guid } from "guid-typescript";

/** POST models */
export type RegisterUserModel = {
  // provided unique email
  email: string;
  // provided unique username
  username: string;
  // user password
  password: string;
  // password confirmation
  confirmPassword: string;
  // country where account was created
  country: string;
};

export type LogInUserModel = {
  // provided email
  email: string;
  // provided password
  password: string;
};

export type RegenerateCodeModel = {};

/** PUT models */

export type VerifyEmailModel = {
  // provided code value
  code: string;
};

export type UpdateProfileModel = {
  // provided or not full name of user
  name: string | null;
  // provided or not description
  bio: string | null;
  // provided or not url to account profile picture
  imageUrl: string | null;
};

export type CheckIfEmailExistsModel = {
  email: string | null;
};

export type GetOtherUserModel = {
  userId: Guid;
};

export type GetRegisterConfModel = {
  configurationId: Guid;
};
