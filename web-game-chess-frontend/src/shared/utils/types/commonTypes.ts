/* commonly occurred types */

import { ColorValue } from "../enums/colorMaps";
import { popupIconTypes } from "../enums/commonConstLists";

// type for svg icons maps and corresponding props
// type for svg icons with params
export type IconSvgProps = {
  iconClass: string;
};

export type IconMap<T extends string> = {
  [key in T]: (iconClass?: string, color?: ColorValue, active?: boolean) => JSX.Element;
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
