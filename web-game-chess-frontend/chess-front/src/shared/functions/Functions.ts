import { mainColor } from "../styles/Variables";

export const generateRandomId = (): string => {
  return Math.random().toString(36);
};

export const getRandomColor = (): string => {
  const keys = Object.keys(mainColor);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  const randomColor = mainColor[randomKey];
  return randomColor;
};
