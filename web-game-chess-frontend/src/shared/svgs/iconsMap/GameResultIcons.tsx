import { dangerColor, greyColor, successColor } from "../../utils/objects/colorMaps";
import { GameResultName } from "../../utils/objects/constantLists";
import { IconMap } from "../../utils/types/commonTypes";

type IconNames = GameResultName;

export const gameResultIcons: IconMap<IconNames> = {
  win: (iconClass?: ElementClass): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={successColor.mid}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L10 16L17 9"
        stroke={successColor.mid}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  draw: (iconClass?: ElementClass): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={greyColor.c5}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 10L15 10" stroke={greyColor.c5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 14L15 14" stroke={greyColor.c5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  lose: (iconClass?: ElementClass): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={dangerColor.mid}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9L15 15" stroke={dangerColor.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 15L15 9" stroke={dangerColor.mid} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
