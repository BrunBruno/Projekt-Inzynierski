// user controller models to requests

import { Guid } from "guid-typescript";

export type GetRegisterConfModel = {
  configurationId: Guid;
};

export type LogInUserModel = {
  email: string;
  password: string;
};

export type RegenerateCodeModel = {};

export type RegisterUserModel = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  country: string;
};

export type VerifyEmailModel = {
  code: string;
};

export type UpdateProfileModel = {
  name: string | null;
  bio: string | null;
  imageUrl: string | null;
};

export type CheckIfEmailExistsModel = {
  email: string | null;
};

export type GetOtherUserModel = {
  userId: Guid;
};
