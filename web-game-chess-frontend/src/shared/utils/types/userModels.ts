/* user controller models to requests */

import { TimingType } from "../objects/entitiesEnums";
import { PagedModel } from "./abstractDtosAndModels";

/** POST models */

export type RegisterUserModel = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  country: string;
};

export type LogInUserModel = {
  emailOrUsername: string;
  password: string;
};

export type RegenerateCodeModel = {};

/** PUT models */

export type VerifyEmailModel = {
  code: string;
};

export type UpdateProfileModel = {
  name: string | null;
  bio: string | null;
  imageFile: File | null;
};

/** GET models */

export type GetByEmailModel = {
  email: string | null;
};

export type GetRegisterConfModel = {
  configurationId: number;
};

export type SendResetPasswordCodeModel = {
  email: string;
};

export type ResetPasswordModel = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export type GetUsersRankingModel = PagedModel & {
  type: TimingType;
  global: boolean;
};
