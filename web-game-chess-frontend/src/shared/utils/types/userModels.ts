export type RegisterUserModel = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type LogInUserModel = {
  email: string;
  password: string;
};

export type VerifyEmailModel = {
  code: string;
};
