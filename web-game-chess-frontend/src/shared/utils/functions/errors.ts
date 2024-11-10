/* error related global functions */

import { AxiosError } from "axios";
import { SetStateAction } from "react";

// Gets messages for registration errors to display
export const errorDisplay = (error: any, action: (value: SetStateAction<string>) => void): void => {
  console.error(error);

  if (error.response && checkError(error)) {
    action(error.response.data);
  } else {
    action("SOMETHING WENT WRONG");
  }
};

// get messages for popups to display
export const getErrMessage = (error: any): string => {
  console.error(error);

  if (error.response && checkError(error)) {
    return error.response.data.toUpperCase();
  } else {
    return "CONNECTION ERROR";
  }
};

// checks if error should be display
const checkError = (error: any): boolean => {
  const statusCodes: number[] = [400, 401, 404];

  return (
    (error instanceof AxiosError || error.isAxiosError) &&
    error?.response?.data &&
    typeof error.response.data === "string" &&
    statusCodes.includes(error.response.status)
  );
};
