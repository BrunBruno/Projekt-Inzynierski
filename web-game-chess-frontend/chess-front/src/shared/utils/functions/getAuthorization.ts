// api base urls
export const baseUrl: string = 'http://localhost:5125/api';
// export const baseUrl: string = " http://192.168.1.46:5125/api";

type headers = {
  headers: {
    Authorization: string;
  };
};

// get authorization token for api calls
export const getAuthorization = (): headers => {
  const token = localStorage.getItem('token');
  console.log(token);
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        headers: {
          Authorization: ``,
        },
      };
};
