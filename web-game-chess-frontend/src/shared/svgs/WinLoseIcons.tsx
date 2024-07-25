import { dangerColor, greyColor, successColor } from "../utils/enums/colorMaps";
import { IconMap, IconsMapProps } from "../utils/types/commonTypes";

const icons: IconMap = {
  win: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  draw: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  lose: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function WinLoseIcons({ iconName }: IconsMapProps) {
  if (iconName === "") return <>i</>;

  try {
    const icon = icons[iconName];
    return icon ? icon : <>i</>;
  } catch (err) {
    console.error("Icon error");
  }

  return <>i</>;
}

export default WinLoseIcons;
