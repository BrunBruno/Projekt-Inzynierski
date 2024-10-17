import { GetRegisterConfDto } from "../../../shared/utils/types/userDtos";

// result of input validation
export type ValidationResult = {
  // is input valid
  isValid: boolean;
  // optional message if input is not valid
  message: string;
};

// to check user input with db configuration record
export const checkFromConfiguration = (
  field: string,
  data: string,
  configuration: GetRegisterConfDto
): ValidationResult => {
  let isValid: boolean = true;
  let message: string = "";

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

  const result: ValidationResult = { isValid, message };

  return result;
};
