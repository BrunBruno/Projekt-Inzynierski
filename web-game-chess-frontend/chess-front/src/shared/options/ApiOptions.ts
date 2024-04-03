export const baseUrl: string = "http://localhost:5125/api";

export const authorization = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};
