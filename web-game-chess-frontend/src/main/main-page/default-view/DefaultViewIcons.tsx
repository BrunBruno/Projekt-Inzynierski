import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../../shared/utils/types/commonTypes";

type IconNames = "games" | "users" | "quick";

export const defaultViewIcons: IconMap<IconNames> = {
  games: (iconClass?: ElementClass, color?: string) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM4 19V12H12V20H5C4.44772 20 4 19.5523 4 19ZM20 12H12V4H19C19.5523 4 20 4.44772 20 5V12Z"
        fill={color ? color : greyColor.c0}
      />
    </svg>
  ),

  users: (iconClass?: ElementClass, color?: string) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle cx="12" cy="9" r="3" stroke={color ? color : greyColor.c0} strokeWidth="1.5" />
      <path
        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  quick: (iconClass?: ElementClass, color?: string) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <rect x="2" y="2" width="20" height="20" rx="2" fill={"none"}></rect>
      <path
        d="M16.6,11.2l-4-3A1,1,0,0,0,11,9v1L8.6,8.2A1,1,0,0,0,7,9v6a1,1,0,0,0,1.6.8L11,14v1a1,1,0,0,0,.55.89,1,1,0,0,0,1-.09l4-3a1,1,0,0,0,0-1.6Z"
        fill={color ? color : greyColor.c0}
      />
    </svg>
  ),
};
