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
    return error.response.data;
  } else {
    return "CONNECTION ERROR";
  }
};

// checks if error should be display
const checkError = (error: any): boolean => {
  return (
    error instanceof AxiosError &&
    error.response &&
    error.response.data &&
    typeof error.response.data === "string" &&
    (error.response.status === 400 || error.response.status === 401 || error.response.status === 404)
  );
};
