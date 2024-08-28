/* commonly occured types */

import { popupIconTypes } from "../enums/commonConstLists";

// type for svg icons
export type IconSvgProps = {
  color?: string;
  iconClass: string;
};

// type for svg icons maps and corresponding props
// type for svg icons with params
export type IconMap = {
  [key: string]: JSX.Element;
};
export type IconsMapProps = {
  icons: IconMap;
  iconName: string;
};
export type IconParamMap = {
  [key: string]: (iconClass: string, color: string) => JSX.Element;
};

// handle on scoll function type
export type HandleOnScroll = {
  handleOnScroll: () => void;
};

// xy position of mouse
export type MousePosition = {
  x: number;
  y: number;
};

// pie chart data object
export type ChartObject = {
  id: number;
  value: number;
  label: string;
};

// popup data object
export type PopupType = {
  popupText: string;
  popupType: typeof popupIconTypes[number];
};
