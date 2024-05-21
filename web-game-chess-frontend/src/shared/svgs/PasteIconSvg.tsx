import { IconSvgProps } from "../utils/types/commonTypes";

function PasteIconSvg({ color, iconClass }: IconSvgProps) {
  return (
    <svg
      fill={color}
      viewBox="0 0 36 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={iconClass}
    >
      <path d="M30,12H26v2h4v2h2V14A2,2,0,0,0,30,12Z"></path>
      <rect x="30" y="18" width="2" height="6"></rect>
      <path d="M30,30H28v2h2a2,2,0,0,0,2-2V26H30Z"></path>
      <rect x="4" y="4" width="20" height="20" rx="2" ry="2"></rect>
      <rect x="20" y="30" width="6" height="2"></rect>
      <path d="M14,26H12v4a2,2,0,0,0,2,2h4V30H14Z"></path>
      <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
    </svg>
  );
}

export default PasteIconSvg;
