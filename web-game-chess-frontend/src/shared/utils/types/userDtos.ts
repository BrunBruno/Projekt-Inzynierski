// user controller dtos

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
  name: string;
  fullName: string | null;
  imageUrl: string | null;
};

export type IsEmailVerifiedDto = {
  isEmailVerified: boolean;
};
