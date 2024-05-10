type colorMap = {
  [key: string]: string;
};

// generate radom color from color map
export const generateRandomColor = (colorMap: colorMap): string => {
  const keys = Object.keys(colorMap);

  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];
  const randomColor = colorMap[randomKey];

  return randomColor;
};
