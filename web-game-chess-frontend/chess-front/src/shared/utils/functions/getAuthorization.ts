// api base urls
export const baseUrl: string = 'http://localhost:5125/api';
// export const baseUrl: string = " http://192.168.1.46:5125/api";

//get authorization token for api calls
export const getAuthorization = (): Record<string, string> => {
  const token = localStorage.getItem('token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : { Authorization: '' };
};
