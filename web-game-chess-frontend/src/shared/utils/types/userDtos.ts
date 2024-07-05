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
  userName: string;
  fullName: string | null;
  imageUrl: string | null;
};

export type IsEmailVerifiedDto = {
  isEmailVerified: boolean;
};

export type GetEloDto = {
  bullet: number;
  blitz: number;
  rapid: number;
  classic: number;
  daily: number;
};
