import { IconSvgProps } from "../utils/types/commonTypes";

function RoundArrowSvg({ color, iconClass }: IconSvgProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <circle cx="250" cy="250" r="250" fill={color} />
      <rect x="92" y="235" width="300" height="30" rx="15" fill="#000" />
      <rect
        x="288.213"
        y="139"
        width="150"
        height="30"
        rx="15"
        transform="rotate(45 288.213 139)"
        fill="#000"
      />
      <rect
        x="271"
        y="335.066"
        width="150"
        height="30"
        rx="15"
        transform="rotate(-45 271 335.066)"
        fill="#000"
      />
    </svg>
  );
}

export default RoundArrowSvg;
