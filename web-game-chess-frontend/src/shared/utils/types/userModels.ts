/* user controller models to requests */

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
  emailOrUsername: string;
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
  imageFile: File | null;
};

/** GET models */

export type GetByEmailModel = {
  // provided email
  email: string | null;
};

export type GetRegisterConfModel = {
  // configuration id
  configurationId: number;
};

export type SendResetPasswordCodeModel = {
  // to for password recovery
  email: string;
};

export type ResetPasswordModel = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};
