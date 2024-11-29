import { ColorValue, dangerColor, infoColor, successColor, warningColor } from "../../utils/objects/colorMaps";
import { PopupIconName } from "../../utils/objects/constantLists";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";

type IconNames = "arrow" | "roundArrow" | "x" | PopupIconName;

export const symbolIcons: IconMap<IconNames> = {
  arrow: (iconClass?: ElementClass, color?: ColorValue): JSX.Element => (
    <svg viewBox="-4.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <g fill="none">
        <g transform="translate(-305.000000, -6679.000000)" fill={color}>
          <g transform="translate(56.000000, 160.000000)">
            <path d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769" />
          </g>
        </g>
      </g>
    </svg>
  ),

  roundArrow: (iconClass?: ElementClass, color?: ColorValue): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  x: (iconClass?: ElementClass, color?: ColorValue): JSX.Element => (
    <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
        fill={color}
      />
    </svg>
  ),

  success: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      viewBox="-1.7 0 20.4 20.4"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      fill={color ? color : successColor.mid}
    >
      <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.105-4.498a.791.791 0 0 0-1.082.29l-3.828 6.63-1.733-2.08a.791.791 0 1 0-1.216 1.014l2.459 2.952a.792.792 0 0 0 .608.285.83.83 0 0 0 .068-.003.791.791 0 0 0 .618-.393L12.6 6.866a.791.791 0 0 0-.29-1.081z" />
    </svg>
  ),

  info: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM10.25 11C10.25 10.4477 10.6977 10 11.25 10H12.75C13.3023 10 13.75 10.4477 13.75 11V18C13.75 18.5523 13.3023 19 12.75 19H11.25C10.6977 19 10.25 18.5523 10.25 18V11ZM14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7Z"
        fill={color ? color : infoColor.mid}
      />
    </svg>
  ),

  warning: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256zm0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4z"
        fill={color ? color : warningColor.mid}
      />
    </svg>
  ),

  error: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      viewBox="-1.7 0 20.4 20.4"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      fill={color ? color : dangerColor.mid}
    >
      <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-6.804.01 3.032-3.033a.792.792 0 0 0-1.12-1.12L8.494 9.173 5.46 6.14a.792.792 0 0 0-1.12 1.12l3.034 3.033-3.033 3.033a.792.792 0 0 0 1.12 1.119l3.032-3.033 3.033 3.033a.792.792 0 0 0 1.12-1.12z" />
    </svg>
  ),
};
