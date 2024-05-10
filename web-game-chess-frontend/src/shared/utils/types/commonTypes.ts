export type IconSvgProps = {
  color: string;
  iconClass: string;
};

export type IconMap = {
  [key: string]: JSX.Element;
};

export type IconsMapProps = {
  iconName: string;
};

export type HandleOnScroll = {
  handleOnScroll: () => void;
};
