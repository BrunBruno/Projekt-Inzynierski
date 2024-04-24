type DataConfigurationsType = {
  [key: string]: number;
};

export const dataConfigurations: DataConfigurationsType = {
  userPassword: 1,
  userName: 2,
};

export type ConfigurationData = {
  minLength: number | null;
  maxLength: number | null;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
};
