// type from enums s to n
export type EnumType = {
  [key: string]: number;
};

// type for svg icons
export type IconSvgProps = {
  color: string;
  iconClass: string;
};

// type for svg icons maps
export type IconMap = {
  [key: string]: JSX.Element;
};

// type for props of icon maps
export type IconsMapProps = {
  iconName: string;
};

//
export type HandleOnScroll = {
  handleOnScroll: () => void;
};
