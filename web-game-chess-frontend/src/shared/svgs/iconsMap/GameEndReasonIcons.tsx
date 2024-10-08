import { greyColor } from "../../utils/objects/colorMaps";
import { IconMap } from "../../utils/types/commonTypes";

type IconNames =
  | "checkMate"
  | "outOfTime"
  | "resignation"
  | "stalemate"
  | "threefold"
  | "agreement"
  | "fiftyMovesRule"
  | "insufficientMaterial";

export const gameEndReasonIcons: IconMap<IconNames> = {
  checkMate: (): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 7L8 17" stroke={greyColor.c0} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7L13 17" stroke={greyColor.c0} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10H7" stroke={greyColor.c0} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 14H6" stroke={greyColor.c0} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
        stroke={greyColor.c0}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  outOfTime: (): JSX.Element => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={greyColor.c0}>
      <path d="M23.707,15.293a1,1,0,0,0-1.414,0L19.5,18.086l-2.793-2.793a1,1,0,0,0-1.414,1.414L18.086,19.5l-2.793,2.793a1,1,0,1,0,1.414,1.414L19.5,20.914l2.793,2.793a1,1,0,0,0,1.414-1.414L20.914,19.5l2.793-2.793A1,1,0,0,0,23.707,15.293Z M12,22A10,10,0,1,1,22,12a1,1,0,0,0,2,0A12,12,0,1,0,12,24a1,1,0,0,0,0-2Z M12,6a1,1,0,0,0-1,1v4.586L8.293,14.293a1,1,0,1,0,1.414,1.414l3-3A1,1,0,0,0,13,12V7A1,1,0,0,0,12,6Z" />
    </svg>
  ),

  resignation: (): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.75 1C6.16421 1 6.5 1.33579 6.5 1.75V3.6L8.22067 3.25587C9.8712 2.92576 11.5821 3.08284 13.1449 3.70797L13.3486 3.78943C14.9097 4.41389 16.628 4.53051 18.2592 4.1227C19.0165 3.93339 19.75 4.50613 19.75 5.28669V12.6537C19.75 13.298 19.3115 13.8596 18.6864 14.0159L18.472 14.0695C16.7024 14.5119 14.8385 14.3854 13.1449 13.708C11.5821 13.0828 9.8712 12.9258 8.22067 13.2559L6.5 13.6V21.75C6.5 22.1642 6.16421 22.5 5.75 22.5C5.33579 22.5 5 22.1642 5 21.75V1.75C5 1.33579 5.33579 1 5.75 1Z"
        fill={greyColor.c0}
      />
    </svg>
  ),

  stalemate: (): JSX.Element => <p>=</p>,

  threefold: (): JSX.Element => <p>3</p>,

  agreement: (): JSX.Element => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={greyColor.c0}
        d="M30.68,19.05l-1.9.64-1.65-9.06,4.24-1.7a1,1,0,1,0-.74-1.86l-5,2A1,1,0,0,0,25,10.18l0,.18-2.39,1.19a1,1,0,0,1-1.05-.09L19.13,9.6a3,3,0,0,0-1.8-.6H14.62a2,2,0,0,0-1.78,1.09L11.05,10a1,1,0,0,0-.5.11l-1.67.83L6,10.22l0-.13a1,1,0,0,0-.55-1l-4-2a1,1,0,0,0-.9,1.78l3.39,1.7-.82,9.06-1.8-.6A1,1,0,1,0,.68,21l3,1A1.19,1.19,0,0,0,4,22a1.1,1.1,0,0,0,.55-.16A1,1,0,0,0,5,21.09l.08-.93,1.29.64a3.07,3.07,0,0,0,1.09,1.89l5.77,4.14a2,2,0,0,0,2.84-.3,2.91,2.91,0,0,0,2.36-.13l5.41-2.7A2.31,2.31,0,0,0,25.08,22a1.71,1.71,0,0,0,0-.32l1.9-.63,0,.12a1,1,0,0,0,.47.68A1,1,0,0,0,28,22a1.19,1.19,0,0,0,.32-.05l3-1a1,1,0,1,0-.64-1.9Zm-22,2.06A1,1,0,0,1,8.38,20a.2.2,0,0,1,.15-.14c.06,0,.14,0,.26.08l6.05,4.37-.33,1,0,0Zm14.26.8-5.41,2.7a1,1,0,0,1-.76.06,2,2,0,0,0-.72-1.92l-6-4.37A2.22,2.22,0,0,0,8,18a2.19,2.19,0,0,0-1.18.84l-1.36-.68a.61.61,0,0,0-.18-.05l.53-5.83,3,.74L9,13a1,1,0,0,0,.45-.11L11.21,12l.65,0-.75,1.51a1,1,0,0,0,.44,1.34l.21.11a3,3,0,0,0,3.83-1h1l6.38,7.29a1.19,1.19,0,0,0,.09.15.26.26,0,0,1,.08.25A.27.27,0,0,1,23,21.91Zm1.36-2.07-6.56-7.5A1,1,0,0,0,17,12H15a1,1,0,0,0-.89.55l-.11.21a1,1,0,0,1-.5.47L14.62,11h2.71a1,1,0,0,1,.6.2l2.48,1.86a3,3,0,0,0,3.14.28l1.87-.93,1.21,6.66Z"
      />
    </svg>
  ),

  fiftyMovesRule: (): JSX.Element => <p>50</p>,

  insufficientMaterial: (): JSX.Element => <p>x</p>,
};

//todotodo
