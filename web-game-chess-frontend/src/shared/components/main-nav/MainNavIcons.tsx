import { greyColor } from "../../utils/enums/colorMaps";
import { IconMap } from "../../utils/types/commonTypes";
import classes from "./MainNav.module.scss";

export const mainNavIcons: IconMap = {
  account: () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={greyColor.c0} className={classes["nav-icon"]}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z
        m0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z
        m0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
      />
    </svg>
  ),

  addFriend: () => (
    <svg fill={greyColor.c0} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={classes["nav-icon"]}>
      <path
        d="M13,7.13A3.66,3.66,0,0,0,12,7a4,4,0,1,0,3.46,6"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
      <path
        data-name="secondary"
        d="M12,15a5,5,0,0,0-5,4.5,9,9,0,0,0,9.94,0A5,5,0,0,0,12,15Zm5-6h4M19,7v4"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
      <path
        d="M20.48,15a8.86,8.86,0,0,1-2.12,3.36A9,9,0,1,1,16,3.94"
        fill="none"
        stroke={greyColor.c0}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      ></path>
    </svg>
  ),

  home: () => (
    <svg
      fill={greyColor.c0}
      viewBox="0 0 512 512"
      version="1.1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classes["nav-icon"]}
    >
      <g>
        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M404.861,263.236 L404.861,263.236c-7.297,7.297-18.066,8.993-26.986,5.104v97.098c0,20.193-16.37,36.562-36.562,36.562H170.688   c-20.193,0-36.562-16.37-36.562-36.562v-97.098c-8.919,3.89-19.689,2.193-26.986-5.104c-9.519-9.519-9.519-24.952,0-34.471   L238.764,97.139h0c9.519-9.519,24.952-9.519,34.471,0l131.625,131.625C414.38,238.283,414.38,253.717,404.861,263.236z" />

        <path d="M286.469,267.938h-60.938c-6.731,0-12.188,5.457-12.188,12.188v73.125c0,6.731,5.457,12.188,12.188,12.188h60.938   c6.731,0,12.188-5.457,12.188-12.188v-73.125C298.656,273.394,293.2,267.938,286.469,267.938z" />
      </g>
    </svg>
  ),

  logOut: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes["nav-icon"]}>
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
