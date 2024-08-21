import { AxiosError } from "axios";

// Gets messages for registration errors to display
export const errorDisplay = (error: any, action: (value: React.SetStateAction<string>) => void) => {
  console.log(error);

  if (error.response && checkError(error)) {
    action(error.response.data);
  } else {
    action("Something went wrong.");
  }
};

// Get messages for popups to display
export const getErrMessage = (error: any): string => {
  console.log(error);

  if (error.response && checkError(error)) {
    return error.response.data;
  } else {
    return "Connection error";
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
