import { ColorValue, mainColor } from "../../utils/objects/colorMaps";
import { PieceTag } from "../../utils/objects/constantLists";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";

type IconNames = PieceTag;

export const piecesIconsVariantC: IconMap<IconNames> = {
  p: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M312.07 194.46A56.07 56.07 0 1 1 256 138.39a56.07 56.07 0 0 1 56.07 56.07zM406 418.01H106v60h300v-60zM282.33 261.52a71.81 71.81 0 0 1-52.15.2c-.73 58.91-62.35 114.06-96.75 140.28H378.9c-34.09-26.33-95.44-81.78-96.57-140.48z"
      />
    </svg>
  ),

  n: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M60.81 476.91h300v-60h-300v60zm233.79-347.3l13.94 7.39c31.88-43.62 61.34-31.85 61.34-31.85l-21.62 53 35.64 19 2.87 33 64.42 108.75-43.55 29.37s-26.82-36.39-39.65-43.66c-10.66-6-41.22-10.25-56.17-12l-67.54-76.91-12 10.56 37.15 42.31c-.13.18-.25.37-.38.57-35.78 58.17 23 105.69 68.49 131.78H84.14C93 85 294.6 129.61 294.6 129.61z"
      />
    </svg>
  ),

  b: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M406.02 476.915h-300v-60h300v60zm-83.46-181H189.48v17.65h133.08v-17.65zm11.78-77.69a200 200 0 0 1-9.39 61.69H187.09a200 200 0 0 1-9.39-61.69c0-59.09 23.82-109 56.41-124.67a33.34 33.34 0 1 1 43.82 0c32.59 15.71 56.41 65.58 56.41 124.67zm-51.07-48.91h-19.25v-23.92h-16v23.92h-19.26v16h19.26v51.54h16v-51.54h19.25v-16zm38.15 180.69v-20.44h-130.8v20.44H93.29v.11l49.46 49.46h82.08l31.15-36 31.15 36h82.44l48.87-48.87.27-.69h-97.29z"
      />
    </svg>
  ),

  r: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M406 484.7H106v-60h300v60zm-56.67-330.83h-50.05V91.3h-82.39v62.57h-54.22V91.3h-54.23v113.67h295.12V91.3h-54.23v62.57zm23.35 67.23H139.32v187.6h233.36V221.1z"
      />
    </svg>
  ),

  q: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M477.518 181.966a25 25 0 0 1-34.91 23l-62.29 150.26h-248.92l-62.24-150.19a25 25 0 1 1 9.73-7.29l87 71.2 20.92-126.4a25 25 0 1 1 14.7-1.85l54.31 117 54.42-117.3a25 25 0 1 1 14.58 2.08l20.93 126.42 87.26-71.3a25 25 0 1 1 44.51-15.63zm-71.66 241.25h-300v60h300v-60zm-27.75-52h-244.22v36h244.22v-36z"
      />
    </svg>
  ),

  k: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      className={iconClass}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
      }}
    >
      <path
        fill={color ? color : mainColor.c9}
        d="M405.995 477.15h-300v-60h300v60zm-10.3-107.13h-279.4a96.88 96.88 0 0 1 6.65 31.12h266.1a96.88 96.88 0 0 1 6.65-31.12zm-139.7-241.06a35.76 35.76 0 0 0-35.76 35.76c0 50.16 35.76 99.34 35.76 99.34s35.76-49.18 35.76-99.34a35.76 35.76 0 0 0-35.76-35.76zm8-15.38V94.24h18.36v-16h-18.36V54.85h-16v23.39h-18.36v16h18.36v19.38a51.9 51.9 0 0 1 16-.04zm81.64 51.36a98.74 98.74 0 0 0-38.13 7.61c-3.23 51.75-37.07 98.85-38.58 100.93l-4.93 6.76V354h140c16.57-26.15 40.78-42.41 40.78-90a99.13 99.13 0 0 0-99.14-99.07zm-141.16 7.61a99.16 99.16 0 0 0-137.25 91.51c0 47.55 24.21 63.82 40.78 90h139.99v-73.82l-4.94-6.79c-1.51-2.05-35.34-49.15-38.58-100.9z"
      />
    </svg>
  ),
};
