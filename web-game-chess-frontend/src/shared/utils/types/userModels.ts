/* user controller models to requests */

import { AppearanceOfBoard, AppearanceOfGamePage, AppearanceOfPieces, TimingType } from "../objects/entitiesEnums";
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

export type SendResetPasswordCodeModel = {
  email: string;
};

export type ResetPasswordModel = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordModel = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UpdateProfileModel = {
  name: string | null;
  bio: string | null;
  clearImage?: boolean;
  imageFile: File | null;
  clearBackground?: boolean;
  backgroundFile: File | null;
};

export type UpdateUserDataModel = {
  profileIsPrivate?: boolean;
};

export type UpdateUserSettingsModel = {
  appearanceOfBoard: AppearanceOfBoard | null;
  appearanceOfGamePage: AppearanceOfGamePage | null;
  appearanceOfPieces: AppearanceOfPieces | null;
};

/** GET models */

export type GetByEmailModel = {
  email: string | null;
};

export type GetRegisterConfModel = {
  configurationId: number;
};

export type GetUsersRankingModel = PagedModel & {
  type: TimingType;
};
