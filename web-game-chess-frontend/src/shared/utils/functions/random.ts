/* function for random generating */

// generate random id with given base
export const generateRandomId = (base: number): string => {
  return Math.random().toString(base);
};

type ColorMap = {
  [key: string]: string;
};

// generate radom color from color map
export const generateRandomColor = (colorMap: ColorMap): string => {
  const keys = Object.keys(colorMap);

  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  const randomColor = colorMap[randomKey];

  return randomColor;
};
