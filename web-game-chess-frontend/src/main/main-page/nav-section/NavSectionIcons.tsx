import { greyColor } from "../../../shared/utils/enums/colorMaps";
import {
  IconMap,
  IconsMapProps,
} from "../../../shared/utils/types/commonTypes";
import classes from "./NavSection.module.scss";

const icons: IconMap = {
  account: (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={greyColor.c0}
      className={classes["nav-icon"]}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  ),
  logOut: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes["nav-icon"]}
    >
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

function NavSectionIcons({ iconName }: IconsMapProps) {
  const icon = icons[iconName];

  return icon ? icon : <></>;
}

export default NavSectionIcons;
