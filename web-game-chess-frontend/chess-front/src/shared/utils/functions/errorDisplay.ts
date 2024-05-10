import { AxiosError } from "axios";

export const errorDisplay = (
  error: any,
  action: (value: React.SetStateAction<string>) => void
) => {
  if (error instanceof AxiosError) {
    if (error.response && error.response.data) {
      action(error.response.data);
    } else if (error.message) {
      action(error.message);
    }
  }
};
