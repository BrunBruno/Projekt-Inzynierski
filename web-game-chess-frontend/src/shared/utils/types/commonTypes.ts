/* commonly occurred types */

import { popupIconTypes } from "../enums/commonConstLists";

// type for svg icons maps and corresponding props
// type for svg icons with params
export type IconSvgProps = {
  iconClass: string;
};

export type IconMap = {
  [key: string]: (iconClass?: string, color?: string, active?: boolean) => JSX.Element;
};

export type IconsMapProps = {
  icons: IconMap;
  iconName: string;
  iconClass?: string;
  color?: string;
  active?: boolean;
};
//*/

// handle on scroll function type
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
