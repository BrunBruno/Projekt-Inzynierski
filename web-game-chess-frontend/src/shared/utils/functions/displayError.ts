import { AxiosError } from "axios";

// back-end error displaying
export const errorDisplay = (error: any, action: (value: React.SetStateAction<string>) => void) => {
  if (error instanceof AxiosError) {
    if (error.response && error.response.data) {
      action(error.response.data);
    } else {
      action("Something went wrong.");
    }
  } else {
    action("Something went wrong.");
  }
};

export const getErrMessage = (error: any): string => {
  console.log(error);

  if (error instanceof AxiosError) {
    if (error.response && error.response.data) {
      return error.response.data;
    } else {
      return "Connection error";
    }
  } else {
    return "Connection error";
  }
};
