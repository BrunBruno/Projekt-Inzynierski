import { ColorValue, greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../../shared/utils/types/commonTypes";

type IconNames = "engine" | "undo" | "timing";

export const botSelectionIcons: IconMap<IconNames> = {
  engine: (iconClass?: ElementClass) => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      className={iconClass}
    >
      <path d="M23,25H9c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h14c1.1,0,2,0.9,2,2v14C25,24.1,24.1,25,23,25z" />
      <path d="M19,21h-6c-1.1,0-2-0.9-2-2v-6c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2v6C21,20.1,20.1,21,19,21z" />

      {/* top y1=3 */}
      <line x1="14" y1="1" x2="14" y2="7" />
      <line x1="10" y1="5" x2="10" y2="7" />
      <line x1="22" y1="3" x2="22" y2="7" />
      <line x1="18" y1="4" x2="18" y2="7" />

      {/* bottom y2=29 */}
      <line x1="14" y1="25" x2="14" y2="27" />
      <line x1="10" y1="25" x2="10" y2="30" />
      <line x1="22" y1="25" x2="22" y2="28" />
      <line x1="18" y1="25" x2="18" y2="29" />

      {/* x2=29 */}
      <line x1="25" y1="18" x2="27" y2="18" />
      <line x1="25" y1="22" x2="28" y2="22" />
      <line x1="25" y1="10" x2="28" y2="10" />
      <line x1="25" y1="14" x2="29" y2="14" />

      {/* x1=7 */}
      <line x1="2" y1="18" x2="7" y2="18" />
      <line x1="3" y1="22" x2="7" y2="22" />
      <line x1="4" y1="10" x2="7" y2="10" />
      <line x1="3" y1="14" x2="7" y2="14" />
    </svg>
  ),

  undo: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00002 15.3802H13.92C15.62 15.3802 17 14.0002 17 12.3002C17 10.6002 15.62 9.22021 13.92 9.22021H7.15002"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.57 10.7701L7 9.19012L8.57 7.62012"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  timing: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color ? color : greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
