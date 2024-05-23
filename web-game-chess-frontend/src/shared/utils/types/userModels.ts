// user controller models to requests

export type GetRegisterConfModel = {
  configurationId: number;
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
};

export type VerifyEmailModel = {
  code: string;
};
