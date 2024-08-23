/* functions user in register page */

import { ConfigurationDto } from "../types/userDtos";

export type ValidationResult = {
  isValid: boolean;
  message: string;
};

// to check user input with db configuration record
export const checkFromConfiguration = (
  field: string,
  data: string,
  configuration: ConfigurationDto
): ValidationResult => {
  let isValid = true;
  let message = "";

  if (configuration.minLength && data.length < configuration.minLength) {
    message = `${field} must be longer than ${configuration.minLength} characters.`;
    isValid = false;
  }

  if (configuration.maxLength && data.length > configuration.maxLength) {
    message = `${field} must be shorter than ${configuration.maxLength} characters.`;
    isValid = false;
  }

  if (configuration.requireLowercase && !/[a-z]/.test(data)) {
    message = `${field} must contain at least one lowercase letter.`;
    isValid = false;
  }

  if (configuration.requireUppercase && !/[A-Z]/.test(data)) {
    message = `${field} must contain at least one uppercase letter.`;
    isValid = false;
  }

  if (configuration.requireDigit && !/\d/.test(data)) {
    message = `${field} must contain at least one digit.`;
    isValid = false;
  }

  if (configuration.requireSpecialChar && !/[^a-zA-Z0-9]/.test(data)) {
    message = `${field} must contain at least one special character.`;
    isValid = false;
  }

  return { isValid, message };
};
