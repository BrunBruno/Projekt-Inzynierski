import { greyColor } from "../../../shared/utils/enums/colorMaps";
import { IconSvgProps } from "../../../shared/utils/types/commonTypes";

function SignArrowSvg({ iconClass }: IconSvgProps) {
  return (
    <svg className={iconClass} fill={greyColor.c5} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <g>
        <path
          d="M25,27.8c-0.5,0-0.9-0.3-1-0.8l0-0.2c-1-4.4-4.6-7.5-9-8v3.5c0,0.8-0.5,1.5-1.2,1.8c-0.8,0.3-1.6,0.1-2.2-0.4l-8.3-8.3
      c-0.4-0.4-0.4-1,0-1.4l8.3-8.3C12.2,5.2,13,5,13.8,5.4c0.8,0.3,1.2,1,1.2,1.8v3.6c6.2,0.5,11,5.7,11,12v4c0,0.5-0.4,0.9-0.9,1
      C25.1,27.8,25,27.8,25,27.8z"
        />
      </g>
    </svg>
  );
}

export default SignArrowSvg;
