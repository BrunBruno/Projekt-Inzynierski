import { ColorValue, greyColor } from "../../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../../shared/utils/types/commonTypes";

type IconNames = "history" | "games" | "stats";

export const friendSectionIcons: IconMap<IconNames> = {
  history: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 15L12 9L16 13L21 7"
        stroke={color ? color : greyColor.c0}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

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

  stats: (iconClass?: ElementClass, color?: string) => (
    <svg
      viewBox="0 -0.5 21 21"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={iconClass}
    >
      <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <g transform="translate(-179.000000, -840.000000)" fill={color ? color : greyColor.c0}>
          <g transform="translate(56.000000, 160.000000)">
            <path d="M141.9,697 C141.9,697.552 141.4296,698 140.85,698 C140.2704,698 139.8,697.552 139.8,697 L139.8,683 C139.8,682.448 140.2704,682 140.85,682 C141.4296,682 141.9,682.448 141.9,683 L141.9,697 Z M141.9,680 L139.8,680 C138.63975,680 137.7,680.895 137.7,682 L137.7,698 C137.7,699.105 138.63975,700 139.8,700 L141.9,700 C143.06025,700 144,699.105 144,698 L144,682 C144,680.895 143.06025,680 141.9,680 L141.9,680 Z M134.55,697 C134.55,697.552 134.0796,698 133.5,698 C132.9204,698 132.45,697.552 132.45,697 L132.45,687 C132.45,686.448 132.9204,686 133.5,686 C134.0796,686 134.55,686.448 134.55,687 L134.55,697 Z M134.55,684 L132.45,684 C131.28975,684 130.35,684.895 130.35,686 L130.35,698 C130.35,699.105 131.28975,700 132.45,700 L134.55,700 C135.71025,700 136.65,699.105 136.65,698 L136.65,686 C136.65,684.895 135.71025,684 134.55,684 L134.55,684 Z M127.2,697 C127.2,697.552 126.7296,698 126.15,698 C125.5704,698 125.1,697.552 125.1,697 L125.1,693 C125.1,692.448 125.5704,692 126.15,692 C126.7296,692 127.2,692.448 127.2,693 L127.2,697 Z M127.2,690 L125.1,690 C123.93975,690 123,690.895 123,692 L123,698 C123,699.105 123.93975,700 125.1,700 L127.2,700 C128.36025,700 129.3,699.105 129.3,698 L129.3,692 C129.3,690.895 128.36025,690 127.2,690 L127.2,690 Z" />
          </g>
        </g>
      </g>
    </svg>
  ),
};
