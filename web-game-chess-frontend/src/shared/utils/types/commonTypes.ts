/* commonly occurred types */

import { ColorValue } from "../objects/colorMaps";
import { popupIconTypes } from "../objects/constantLists";

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
  text: string;
  type: typeof popupIconTypes[number];
};

// board matrix objects
export type SMatrix = string[][];
export type NMatrix = number[][];
