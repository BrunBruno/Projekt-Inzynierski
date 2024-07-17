// different colors maps

type colorMap = {
  [key: string]: string;
};

// main color list
export const mainColor: colorMap = {
  c0: "#f3f0ff",
  c1: "#e5dbff",
  c2: "#d0bfff",
  c3: "#b197fc",
  c4: "#9775fa",
  c5: "#845ef7",
  c6: "#7950f2",
  c7: "#7048e8",
  c8: "#6741d9",
  c9: "#5f3dc4",
};

// grey color list
export const greyColor: colorMap = {
  c0: "#f8f9fa",
  c1: "#f1f3f5",
  c2: "#e9ecef",
  c3: "#dee2e6",
  c4: "#ced4da",
  c5: "#adb5bd",
  c6: "#868e96",
  c7: "#495057",
  c8: "#343a40",
  c9: "#212529",
};

// password strenght colors map
export const strengthColor: colorMap = {
  c0: "#f03e3e",
  c1: "#ffa8a8",
  c2: "#ffe066",
  c3: "#8ce99a",
  c4: "#51cf66",
};

export const successColor: colorMap = {
  light: "#8ce99a",
  mid: "#51cf66",
  dark: "#2f9e44",
};

export const infoColor: colorMap = {
  light: "#a5d8ff",
  mid: "#339af0",
  dark: "#1864ab",
};

export const warningColor: colorMap = {
  light: "#ffe066",
  mid: "#fcc419",
  dark: "#f59f00",
};

export const dangerColor: colorMap = {
  light: "#ffa8a8",
  mid: "#f03e3e",
  dark: "#c92a2a",
};
