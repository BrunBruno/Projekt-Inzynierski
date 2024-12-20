import { ColorValue, greyColor, mainColor } from "../../utils/objects/colorMaps";
import { GameEndReasonName } from "../../utils/objects/constantLists";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";

type IconNames = GameEndReasonName;

export const gameEndReasonIcons: IconMap<IconNames> = {
  checkMate: (iconClass?: ElementClass, color?: ColorValue, active?: boolean) => (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      fill="none"
      stroke={active && color ? color : greyColor.c9}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className={iconClass}
      style={{ transform: "scale(1.2)", transformOrigin: "50% 50%" }}
    >
      <circle
        fill={active ? mainColor.c9 : color ? color : greyColor.c0}
        cx="8"
        cy="8"
        r="8"
        style={{ transform: "scale(0.9)", transformOrigin: "50% 50%" }}
      />
      <path
        d="m2.75 10.25h9.5m-8.5-4.5h9.5m-2.5-4-1.5 12.5m-2.5-12.5-1.5 12.5"
        style={{ transform: "scale(0.7)", transformOrigin: "50% 50%" }}
      />
    </svg>
  ),

  outOfTime: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      style={{ transform: "scale(1.1)", transformOrigin: "50% 50%" }}
    >
      <path
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        fill={active ? mainColor.c9 : color ? color : greyColor.c0}
      />
      <path
        d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
        fill={active && color ? color : greyColor.c9}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),

  resignation: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle fill={active ? mainColor.c9 : color ? color : greyColor.c0} strokeWidth={3} cx="12" cy="12" r="12" />
      <path
        d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
        fill={active && color ? color : greyColor.c9}
        style={{ transform: "scale(0.8)", transformOrigin: "50% 50%" }}
      />
    </svg>
  ),

  staleMate: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      fill={active ? mainColor.c9 : color ? color : greyColor.c0}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      xmlSpace="preserve"
      className={iconClass}
    >
      <path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M405.3,341.3c0,11.8-9.5,21.3-21.3,21.3 H128c-11.8,0-21.3-9.6-21.3-21.3v-42.7c0-11.8,9.5-21.3,21.3-21.3h256c11.8,0,21.3,9.6,21.3,21.3V341.3z M405.3,213.3 c0,11.8-9.5,21.3-21.3,21.3H128c-11.8,0-21.3-9.6-21.3-21.3v-42.7c0-11.8,9.5-21.3,21.3-21.3h256c11.8,0,21.3,9.6,21.3,21.3V213.3z" />
    </svg>
  ),

  threefold: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      style={{ transform: "scale(1.1)", transformOrigin: "50% 50%" }}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.19 15.94C17.15 16.03 17.1 16.11 17.03 16.18L15.34 17.87C15.19 18.02 15 18.09 14.81 18.09C14.62 18.09 14.43 18.02 14.28 17.87C13.99 17.58 13.99 17.1 14.28 16.81L14.69 16.4H9.1C7.8 16.4 6.75 15.34 6.75 14.05V12.28C6.75 11.87 7.09 11.53 7.5 11.53C7.91 11.53 8.25 11.87 8.25 12.28V14.05C8.25 14.52 8.63 14.9 9.1 14.9H14.69L14.28 14.49C13.99 14.2 13.99 13.72 14.28 13.43C14.57 13.14 15.05 13.14 15.34 13.43L17.03 15.12C17.1 15.19 17.15 15.27 17.19 15.36C17.27 15.55 17.27 15.76 17.19 15.94ZM17.25 11.72C17.25 12.13 16.91 12.47 16.5 12.47C16.09 12.47 15.75 12.13 15.75 11.72V9.95C15.75 9.48 15.37 9.1 14.9 9.1H9.31L9.72 9.5C10.01 9.79 10.01 10.27 9.72 10.56C9.57 10.71 9.38 10.78 9.19 10.78C9 10.78 8.81 10.71 8.66 10.56L6.97 8.87C6.9 8.8 6.85 8.72 6.81 8.63C6.73 8.45 6.73 8.24 6.81 8.06C6.85 7.97 6.9 7.88 6.97 7.81L8.66 6.12C8.95 5.83 9.43 5.83 9.72 6.12C10.01 6.41 10.01 6.89 9.72 7.18L9.31 7.59H14.9C16.2 7.59 17.25 8.65 17.25 9.94V11.72Z"
        fill={active ? mainColor.c9 : color ? color : greyColor.c0}
      />
    </svg>
  ),

  agreement: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <circle fill={active ? mainColor.c9 : color ? color : greyColor.c0} strokeWidth={3} cx="24" cy="24" r="22" />
      <path
        d="M20.6,38.4l-8-7.9a2.1,2.1,0,0,1-.2-2.7,1.9,1.9,0,0,1,3-.2L22,34.2,42.6,13.6a2,2,0,0,1,2.8,2.8l-22,22A1.9,1.9,0,0,1,20.6,38.4Z"
        fill={active && color ? color : greyColor.c9}
        style={{ transform: "scale(0.8)", transformOrigin: "50% 50%" }}
      />
      <path
        d="M12,39a2,2,0,0,1-1.4-.6l-8-8a1.9,1.9,0,0,1,0-2.8,1.9,1.9,0,0,1,2.8,0l8,8a1.9,1.9,0,0,1,0,2.8A2,2,0,0,1,12,39Z"
        fill={active && color ? color : greyColor.c9}
        style={{ transform: "scale(0.8)", transformOrigin: "50% 50%" }}
      />
      <path
        d="M22,29a2,2,0,0,1-1.4-.6,1.9,1.9,0,0,1,0-2.8l12-12a2,2,0,0,1,2.8,2.8l-12,12A2,2,0,0,1,22,29Z"
        fill={active && color ? color : greyColor.c9}
        style={{ transform: "scale(0.8)", transformOrigin: "50% 50%" }}
      />
    </svg>
  ),

  fiftyMovesRule: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 496.158 496.158"
      xmlSpace="preserve"
      className={iconClass}
    >
      <path
        fill={active ? mainColor.c9 : color ? color : greyColor.c0}
        d="M248.082,0.003C111.07,0.003,0,111.061,0,248.085c0,137,111.07,248.07,248.082,248.07 c137.006,0,248.076-111.07,248.076-248.07C496.158,111.061,385.088,0.003,248.082,0.003z"
      />
      <g>
        <path
          fill={active && color ? color : greyColor.c9}
          d="M231.38,255.136c-3.516-8.496-8.35-15.843-14.502-22.046c-6.152-6.2-13.307-11.06-21.46-14.575 c-8.155-3.516-16.919-5.273-26.294-5.273c-11.719,0-24.513,3.712-38.379,11.133l8.35-47.461h69.58 c7.226,0,12.694-1.561,16.406-4.688c3.71-3.124,5.566-7.226,5.566-12.305c0-11.62-7.617-17.432-22.852-17.432h-77.344 c-8.4,0-14.454,1.904-18.164,5.713c-3.712,3.809-6.251,9.913-7.617,18.311l-12.304,70.166c-1.076,6.152-1.611,9.474-1.611,9.961 c0,4.395,1.854,8.327,5.566,11.792c3.71,3.468,7.958,5.2,12.744,5.2c4.395,0,9.984-2.563,16.772-7.69 c6.786-5.127,11.986-8.716,15.601-10.767c3.612-2.051,9.618-3.076,18.018-3.076c6.834,0,13.037,1.637,18.604,4.907 c5.566,3.273,10.009,8.229,13.33,14.868c3.319,6.642,4.98,14.648,4.98,24.023c0,8.693-1.538,16.457-4.614,23.291 c-3.076,6.837-7.448,12.208-13.11,16.113c-5.665,3.907-12.257,5.859-19.775,5.859c-8.203,0-15.626-2.417-22.266-7.251 c-6.642-4.834-11.916-11.595-15.82-20.288c-4.005-9.471-10.107-14.209-18.311-14.209c-4.786,0-8.766,1.71-11.938,5.127 c-3.175,3.419-4.761,7.031-4.761,10.84c0,6.251,2.271,13.55,6.812,21.899s12.254,15.747,23.145,22.192 c10.888,6.445,25.072,9.668,42.554,9.668c15.624,0,29.418-3.419,41.382-10.254c11.961-6.834,21.117-16.063,27.466-27.686 c6.347-11.62,9.521-24.511,9.521-38.672C236.653,272.765,234.895,263.632,231.38,255.136z"
        />
        <path
          fill={active && color ? color : greyColor.c9}
          d="M401.009,181.747c-4.298-9.276-9.547-17.065-15.747-23.364c-6.203-6.299-13.403-11.083-21.606-14.355c-8.203-3.271-17.335-4.907-27.393-4.907c-15.234,0-28.345,3.688-39.331,11.06 c-10.986,7.375-19.361,18.091-25.122,32.153c-3.321,8.496-5.763,18.654-7.324,30.469c-1.563,11.817-2.344,25.099-2.344,39.844 c0,11.426,0.707,22.046,2.124,31.86c1.415,9.814,3.637,18.775,6.665,26.88c5.956,14.845,14.818,26.466,26.587,34.863 c11.767,8.4,25.072,12.598,39.917,12.598c12.891,0,24.609-3.126,35.156-9.375s19.139-15.136,25.781-26.66 c5.273-9.375,8.885-19.823,10.84-31.348c1.952-11.522,2.93-25.292,2.93-41.309C412.142,220.664,408.429,197.861,401.009,181.747z M368.929,292.929c-2.051,11.623-5.617,20.558-10.693,26.807c-5.079,6.251-12.11,9.375-21.094,9.375 c-8.693,0-15.578-3.003-20.654-9.009c-5.079-6.006-8.693-14.868-10.84-26.587c-2.149-11.719-3.223-26.756-3.223-45.117 c0-27.049,2.513-47.069,7.544-60.059c5.028-12.987,13.989-19.482,26.88-19.482c8.983,0,16.015,2.907,21.094,8.716 c5.077,5.812,8.69,14.406,10.84,25.781c2.147,11.378,3.223,26.001,3.223,43.872C372.005,266.075,370.979,281.309,368.929,292.929z"
        />
      </g>
    </svg>
  ),

  insufficientMaterial: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      fill={active ? mainColor.c9 : color ? color : greyColor.c0}
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M213.333 960c0-167.36 56-321.707 149.44-446.4L1406.4 1557.227c-124.693 93.44-279.04 149.44-446.4 149.44-411.627 0-746.667-335.04-746.667-746.667m1493.334 0c0 167.36-56 321.707-149.44 446.4L513.6 362.773c124.693-93.44 279.04-149.44 446.4-149.44 411.627 0 746.667 335.04 746.667 746.667M960 0C429.76 0 0 429.76 0 960s429.76 960 960 960 960-429.76 960-960S1490.24 0 960 0"
        fillRule="evenodd"
      />
    </svg>
  ),
};
