import { ColorValue, greyColor } from "../../shared/utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../shared/utils/types/commonTypes";

type IconNames = "background" | "global" | "friends" | "trophy" | "banner";

export const rankingPageIcons: IconMap<IconNames> = {
  background: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      // fill={color ? color : "#000"}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 298 298"
      xmlSpace="preserve"
      className={iconClass}
      fill={color ? (color === "#fff" ? "url(#leftGrad)" : color === "#000" ? "url(#rightGrad)" : color) : "#000"}
    >
      <path d="M216.923,246.538c3.457-6.556,9.963-22.777-1.666-39.137C200.508,186.65,179.942,125,193.61,83H207V0h-16v17h-16V0h-18v17 h-16V0h-17v17h-16V0H91v83h14.057c13.668,42-6.98,103.65-21.73,124.401c-11.629,16.359-5.373,32.706-1.916,39.262 C77.347,247.044,74,250.337,74,254.5v18c0,4.418,3.915,8.5,8.333,8.5H83v17h132v-17h1.333c4.418,0,7.667-4.082,7.667-8.5v-18 C224,250.338,220.986,246.92,216.923,246.538z" />

      <defs>
        <linearGradient id={"leftGrad"} x1="0" y1="149" x2="298" y2="298" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={greyColor.c9} />
          <stop offset="0.7" stopColor={"#000"} />
          <stop offset="1" stopColor={"#000"} />
        </linearGradient>
        <linearGradient id={"rightGrad"} x1="298" y1="149" x2="0" y2="298" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={greyColor.c9} />
          <stop offset="0.7" stopColor={"#000"} />
          <stop offset="1" stopColor={"#000"} />
        </linearGradient>
      </defs>
    </svg>
  ),

  global: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      className={iconClass}
      style={{ transform: "scale(0.9)" }}
    >
      <path
        d="M32,0C14.328,0,0,14.328,0,32s14.328,32,32,32s32-14.328,32-32S49.672,0,32,0z M52.812,20.078 c-2.293,1.973-4.105,3.762-7.457,3.887c-2.562,0.094-4.445,0.105-6.359-1.598c-2.727-2.477-0.859-5.777-0.758-9.504 C38.273,11.43,38.512,10.18,38.824,9C44.789,10.766,49.773,14.789,52.812,20.078z M9.867,41.289c2.09-2.031,5.508-3.109,7.949-5.816 c2.492-2.785,2.41-7.836,6.129-7.375c3.039,0.422,2.5,4.23,4.906,6.125c2.836,2.266,6.328,0.824,8.59,3.676 c2.969,3.77,2.277,8.066,0,12.293c-1.676,3.055-3.836,4.137-6.723,5.742C21.316,55.438,13.34,49.555,9.867,41.289z"
        fill={color ? color : greyColor.c0}
      />
    </svg>
  ),

  friends: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z"
        fill={color ? color : greyColor.c0}
      />
    </svg>
  ),

  trophy: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      fill={color ? color : greyColor.c0}
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M22.994 28.996h-14.060c-0.553 0-1 0.448-1 1s0.447 1 1 1h14.060c0.552 0 1-0.448 1-1s-0.447-1-1-1zM31.791 3.801c-0.095-0.465-0.505-0.799-0.979-0.799h-4.895v-0.998c0-0.552-0.448-1-1-1h-17.985c-0.553 0-1 0.448-1 1v0.998h-4.743c-0.474 0-0.885 0.334-0.98 0.799-0.029 0.144-0.7 3.648 1.247 6.036 1.12 1.373 2.831 2.091 5.078 2.155 1.281 3.786 4.502 6.59 8.381 7.008v6.966h-2.993c-0.553 0-1 0.448-1 1s0.447 1 1 1h8.084c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3.091v-6.965c3.886-0.41 7.114-3.213 8.398-7.003 2.323-0.034 4.085-0.758 5.231-2.162 1.947-2.388 1.276-5.891 1.247-6.036zM3.013 8.58c-0.885-1.078-0.975-2.669-0.929-3.578h3.849v3.376c0 0.54 0.050 1.068 0.123 1.587-1.365-0.127-2.389-0.588-3.042-1.385zM23.917 8.378c0 4.784-3.585 8.677-7.991 8.677-4.408 0-7.994-3.893-7.994-8.677v-5.374h15.986v5.374h-0zM28.988 8.58c-0.677 0.826-1.751 1.296-3.196 1.402 0.075-0.524 0.125-1.057 0.125-1.604v-3.376h4c0.045 0.91-0.044 2.5-0.93 3.578z"
        stroke={color ? color : greyColor.c0}
      />
    </svg>
  ),

  banner: (iconClass?: ElementClass, color?: ColorValue) => (
    <svg
      fill={color ? color : greyColor.c0}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1792 1792"
      xmlSpace="preserve"
      className={iconClass}
    >
      <path d="M896,0l388.4,235.9V1792L896,1553.7L507.6,1792V235.5L896,0z" />
    </svg>
  ),
};
