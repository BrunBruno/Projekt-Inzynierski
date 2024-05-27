import { AxiosError } from "axios";

// back-end error displaying
export const errorDisplay = (
  error: any,
  action: (value: React.SetStateAction<string>) => void
) => {
  if (error instanceof AxiosError) {
    if (error.response && error.response.data) {
      action(error.response.data);
    } else if (error.message) {
      action(error.message);
    } else {
      action("Something went wrong.");
    }
  } else {
    action("Something went wrong.");
  }
};
