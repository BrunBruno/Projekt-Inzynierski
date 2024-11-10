/* shared colors maps */

import { SideColor } from "./constantLists";

// main color list
export const mainColor = {
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
} as const;
type MainColorValue = (typeof mainColor)[keyof typeof mainColor];

// grey color list
export const greyColor = {
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
} as const;
type GreyColorValue = (typeof greyColor)[keyof typeof greyColor];

// password strength colors map
export const strengthColor = {
  c0: "#f03e3e",
  c1: "#ffa8a8",
  c2: "#ffe066",
  c3: "#8ce99a",
  c4: "#51cf66",
} as const;
type StrengthColorValue = (typeof strengthColor)[keyof typeof strengthColor];

// other spacial colors maps
export const successColor = {
  light: "#8ce99a",
  mid: "#51cf66",
  dark: "#2f9e44",
} as const;
type SuccessColorValue = (typeof successColor)[keyof typeof successColor];

export const infoColor = {
  light: "#a5d8ff",
  mid: "#339af0",
  dark: "#1864ab",
} as const;
type InfoColorValue = (typeof infoColor)[keyof typeof infoColor];

export const warningColor = {
  light: "#ffe066",
  mid: "#fcc419",
  dark: "#f59f00",
} as const;
type WarningColorValue = (typeof warningColor)[keyof typeof warningColor];

export const dangerColor = {
  light: "#ffa8a8",
  mid: "#f03e3e",
  dark: "#c92a2a",
} as const;
type DangerColorValue = (typeof dangerColor)[keyof typeof dangerColor];

export type ColorValue =
  | MainColorValue
  | GreyColorValue
  | StrengthColorValue
  | SuccessColorValue
  | InfoColorValue
  | WarningColorValue
  | DangerColorValue
  | SideColor
  | "#000"
  | "#fff";
