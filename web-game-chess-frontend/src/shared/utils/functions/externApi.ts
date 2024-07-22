import axios from "axios";

// to get country flag
export const getCountry = async (): Promise<string> => {
  try {
    const response = await axios.get("https://ipinfo.io");
    return response.data.country;
  } catch (err) {
    console.log(err);
  }

  return "";
};
