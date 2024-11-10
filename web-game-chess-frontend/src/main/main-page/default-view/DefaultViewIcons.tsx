import { greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../../shared/utils/types/commonTypes";

type IconNames = "games" | "users" | "quick";

export const defaultViewIcons: IconMap<IconNames> = {
  games: (iconClass?: ElementClass, color?: string) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M21.2206 8C20.5311 5.81603 19.4281 4.63486 18.0908 4.16059C17.7099 4.02549 17.3016 4 16.8974 4H16.2849C15.4074 4 14.5514 4.27225 13.8351 4.77922L13.3332 5.13441C12.9434 5.41029 12.4776 5.55844 12 5.55844C11.5225 5.55844 11.0567 5.41029 10.6669 5.13443L10.165 4.77922C9.44862 4.27225 8.59264 4 7.71504 4H7.10257C6.69838 4 6.29009 4.02549 5.90915 4.16059C3.52645 5.00566 1.88749 8.09504 2.00604 15.1026C2.02992 16.5145 2.3603 18.075 3.63423 18.6842C4.03121 18.8741 4.49667 19 5.02671 19C5.66273 19 6.1678 18.8187 6.55763 18.5632C7.47153 17.9642 8.14122 16.9639 9.11125 16.4609C9.69519 16.1581 10.3434 16 11.0011 16H12.9989C13.6566 16 14.3048 16.1581 14.8888 16.4609C15.8588 16.9639 16.5285 17.9642 17.4424 18.5632C17.8322 18.8187 18.3373 19 18.9733 19C19.5033 19 19.9688 18.8741 20.3658 18.6842C21.6397 18.075 21.9701 16.5145 21.994 15.1026C22.0132 13.9681 21.9863 12.9362 21.9176 12"
        stroke={color ? color : greyColor.c0}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M7.5 9V12M6 10.5L9 10.5" stroke={color ? color : greyColor.c0} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M19 10.25C19 10.6642 18.6642 11 18.25 11C17.8358 11 17.5 10.6642 17.5 10.25C17.5 9.83579 17.8358 9.5 18.25 9.5C18.6642 9.5 19 9.83579 19 10.25Z"
        fill={color ? color : greyColor.c0}
      />
      <path
        d="M16 10.25C16 10.6642 15.6642 11 15.25 11C14.8358 11 14.5 10.6642 14.5 10.25C14.5 9.83579 14.8358 9.5 15.25 9.5C15.6642 9.5 16 9.83579 16 10.25Z"
        fill={color ? color : greyColor.c0}
      />
      <path
        d="M16.75 8C17.1642 8 17.5 8.33579 17.5 8.75C17.5 9.16421 17.1642 9.5 16.75 9.5C16.3358 9.5 16 9.16421 16 8.75C16 8.33579 16.3358 8 16.75 8Z"
        fill={color ? color : greyColor.c0}
      />
      <path
        d="M16.75 11C17.1642 11 17.5 11.3358 17.5 11.75C17.5 12.1642 17.1642 12.5 16.75 12.5C16.3358 12.5 16 12.1642 16 11.75C16 11.3358 16.3358 11 16.75 11Z"
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
      ></path>
    </svg>
  ),
};
