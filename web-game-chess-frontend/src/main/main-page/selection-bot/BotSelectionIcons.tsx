import { ColorValue, greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../../shared/utils/types/commonTypes";

type IconNames = "engine" | "undo" | "emptyBot" | "fullBot";

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

  emptyBot: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      fill={color ? color : greyColor.c0}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path d="M200,52H132V16a4,4,0,0,0-8,0V52H56A28.03146,28.03146,0,0,0,28,80V192a28.03146,28.03146,0,0,0,28,28H200a28.03146,28.03146,0,0,0,28-28V80A28.03146,28.03146,0,0,0,200,52Zm20,140a20.0226,20.0226,0,0,1-20,20H56a20.0226,20.0226,0,0,1-20-20V80A20.0226,20.0226,0,0,1,56,60H200a20.0226,20.0226,0,0,1,20,20Zm-56-52H92a24,24,0,0,0,0,48h72a24,24,0,0,0,0-48Zm-20,8v32H112V148ZM76,164a16.01833,16.01833,0,0,1,16-16h12v32H92A16.01833,16.01833,0,0,1,76,164Zm88,16H152V148h12a16,16,0,0,1,0,32ZM76,108a8,8,0,1,1,8,8A8.00009,8.00009,0,0,1,76,108Zm88,0a8,8,0,1,1,8,8A8.00009,8.00009,0,0,1,164,108Z" />
    </svg>
  ),

  fullBot: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      fill={color ? color : greyColor.c0}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32.03635,32.03635,0,0,0,24,80V192a32.03635,32.03635,0,0,0,32,32H200a32.03635,32.03635,0,0,0,32-32V80A32.03635,32.03635,0,0,0,200,48ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm28,76H92a16,16,0,0,1,0-32h8Zm40,0H116V152h24Zm24,0h-8V152h8a16,16,0,0,1,0,32Zm8-64a12,12,0,1,1,12-12A12,12,0,0,1,172,120Z" />
    </svg>
  ),
};
