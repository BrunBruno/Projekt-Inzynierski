// type from enums string to number
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

// handle on scoll function type
export type HandleOnScroll = {
  handleOnScroll: () => void;
};

// pagination result type
export type PagedResult<T> = {
  items: T[];
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  totalItemsCount: number;
};

export type PagedRequest = {
  pageNumber: number;
  pageSize: number;
};

export type MousePosition = {
  x: number;
  y: number;
};
