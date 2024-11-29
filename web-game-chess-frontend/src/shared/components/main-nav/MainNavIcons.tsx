import { greyColor } from "../../utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";

type IconNames = "accountPage" | "friendsPage" | "rankingPage" | "logOut";

export const mainNavIcons: IconMap<IconNames> = {
  accountPage: (iconClass?: ElementClass) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle cx="12" cy="9" r="3" stroke={greyColor.c0} strokeWidth="1.5" />
      <path
        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
        stroke={greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
        stroke={greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  friendsPage: (iconClass?: ElementClass) => (
    <svg
      fill={greyColor.c0}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      style={{ transform: "scale(1.1)", transformOrigin: "50% 50%" }}
    >
      <path
        d="M13,7.13A3.66,3.66,0,0,0,12,7a4,4,0,1,0,3.46,6"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        data-name="secondary"
        d="M12,15a5,5,0,0,0-5,4.5,9,9,0,0,0,9.94,0A5,5,0,0,0,12,15Zm5-6h4M19,7v4"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.48,15a8.86,8.86,0,0,1-2.12,3.36A9,9,0,1,1,16,3.94"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  ),

  rankingPage: (iconClass?: ElementClass) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M10.8613 9.36335C11.3679 8.45445 11.6213 8 12 8C12.3787 8 12.6321 8.45445 13.1387 9.36335L13.2698 9.59849C13.4138 9.85677 13.4858 9.98591 13.598 10.0711C13.7103 10.1563 13.8501 10.188 14.1296 10.2512L14.3842 10.3088C15.3681 10.5314 15.86 10.6427 15.977 11.0191C16.0941 11.3955 15.7587 11.7876 15.088 12.572L14.9144 12.7749C14.7238 12.9978 14.6285 13.1092 14.5857 13.2471C14.5428 13.385 14.5572 13.5336 14.586 13.831L14.6122 14.1018C14.7136 15.1482 14.7644 15.6715 14.4579 15.9041C14.1515 16.1367 13.6909 15.9246 12.7697 15.5005L12.5314 15.3907C12.2696 15.2702 12.1387 15.2099 12 15.2099C11.8613 15.2099 11.7304 15.2702 11.4686 15.3907L11.2303 15.5005C10.3091 15.9246 9.84847 16.1367 9.54206 15.9041C9.23565 15.6715 9.28635 15.1482 9.38776 14.1018L9.41399 13.831C9.44281 13.5336 9.45722 13.385 9.41435 13.2471C9.37147 13.1092 9.27617 12.9978 9.08557 12.7749L8.91204 12.572C8.2413 11.7876 7.90593 11.3955 8.02297 11.0191C8.14001 10.6427 8.63194 10.5314 9.61581 10.3088L9.87035 10.2512C10.1499 10.188 10.2897 10.1563 10.402 10.0711C10.5142 9.98591 10.5862 9.85677 10.7302 9.59849L10.8613 9.36335Z"
        stroke={greyColor.c0}
        strokeWidth="1.5"
      />
      <path
        d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
        stroke={greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  logOut: (iconClass?: ElementClass) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796"
        stroke={greyColor.c0}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
