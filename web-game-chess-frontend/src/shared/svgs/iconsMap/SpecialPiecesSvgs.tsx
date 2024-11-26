import { ColorValue } from "../../utils/objects/colorMaps";
import { PieceTag } from "../../utils/objects/constantLists";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";

type IconNames = PieceTag;

export const specialPiecesSvgs: IconMap<IconNames> = {
  p: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      viewBox="-96 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M105.1 224H80a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h16v5.49c0 44-4.14 86.6-24 122.51h176c-19.89-35.91-24-78.51-24-122.51V288h16a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-25.1c29.39-18.38 49.1-50.78 49.1-88a104 104 0 0 0-208 0c0 37.22 19.71 69.62 49.1 88zM304 448H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" />
    </svg>
  ),

  n: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M7.2,16l1.1-0.2c1.6-0.3,3.3-0.5,5-0.7c-2.4,2.3-3.9,5.3-4.7,7.9h14.7c0.4-1.5,1.1-3,2.3-4.1l0.2-0.2 c0.2-0.2,0.3-0.4,0.3-0.6C26.6,13,24.2,8,19.8,5.3c-0.8-1.4-2-2.4-3.6-2.9l-0.9-0.3C15,2,14.7,2,14.4,2.2C14.2,2.4,14,2.7,14,3v2.4 l-1.4,0.7C12.2,6.3,12,6.6,12,7v0.5l-4.7,3.1C6.5,11.1,6,12.1,6,13.1V15c0,0.3,0.1,0.6,0.4,0.8C6.6,16,6.9,16,7.2,16z" />
      <path d="M6.8,25C6.3,25.5,6,26.2,6,27v2c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1v-2c0-0.8-0.3-1.5-0.8-2H6.8z" />
    </svg>
  ),

  b: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      viewBox="-96 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M8 287.88c0 51.64 22.14 73.83 56 84.6V416h192v-43.52c33.86-10.77 56-33 56-84.6 0-30.61-10.73-67.1-26.69-102.56L185 285.65a8 8 0 0 1-11.31 0l-11.31-11.31a8 8 0 0 1 0-11.31L270.27 155.1c-20.8-37.91-46.47-72.1-70.87-92.59C213.4 59.09 224 47.05 224 32a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32c0 15 10.6 27.09 24.6 30.51C67.81 106.8 8 214.5 8 287.88zM304 448H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" />
    </svg>
  ),

  r: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      viewBox="-64 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M368 32h-56a16 16 0 0 0-16 16v48h-48V48a16 16 0 0 0-16-16h-80a16 16 0 0 0-16 16v48H88.1V48a16 16 0 0 0-16-16H16A16 16 0 0 0 0 48v176l64 32c0 48.33-1.54 95-13.21 160h282.42C321.54 351 320 303.72 320 256l64-32V48a16 16 0 0 0-16-16zM224 320h-64v-64a32 32 0 0 1 64 0zm144 128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h352a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" />
    </svg>
  ),

  q: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 277.366 277.366"
      xmlSpace="preserve"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M257.799,55.704c-7.706-3.866-17.016-2.36-23.111,3.734l-39.2,39.201l-38.526-86.757C153.753,4.657,146.589,0,138.683,0 s-15.07,4.657-18.278,11.883L81.878,98.64l-39.2-39.201c-6.094-6.093-15.405-7.6-23.111-3.733 C11.864,59.569,7.502,67.935,8.745,76.463l17.879,122.785c1.431,9.829,9.858,17.118,19.791,17.118h184.536 c9.933,0,18.36-7.289,19.791-17.118l17.88-122.786C269.864,67.934,265.502,59.568,257.799,55.704z" />
      <path d="M230.951,237.366H46.415c-11.046,0-20,8.954-20,20s8.954,20,20,20h184.536c11.046,0,20-8.954,20-20 S241.997,237.366,230.951,237.366z" />
    </svg>
  ),

  k: (iconClass?: ElementClass, color?: ColorValue, active?: boolean): JSX.Element => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 277.299 277.299"
      xmlSpace="preserve"
      className={iconClass}
      fill={color}
      style={{
        filter: active ? (color === "white" ? "drop-shadow(0 0 3px black)" : "drop-shadow(0 0 3px white)") : "none",
        transform: active ? "scale(0.9)" : "none",
      }}
    >
      <path d="M248.325,237.299H28.973c-11.046,0-20,8.954-20,20s8.954,20,20,20h219.353c11.046,0,20-8.954,20-20 S259.371,237.299,248.325,237.299z" />
      <path d="M274.201,121.176c-3.999-18.229-15.083-32.794-30.412-39.961c-4.71-2.202-9.71-3.664-14.868-4.37 c-8.381-16.454-22.173-28.215-38.793-32.534c-5.561-1.445-11.215-2.025-16.845-1.784c0.035-3.916-1.082-7.797-3.268-11.135 L155.381,9.043C151.685,3.4,145.395,0,138.649,0c-6.745,0-13.036,3.4-16.731,9.043l-14.636,22.349 c-2.186,3.338-3.303,7.219-3.268,11.135c-5.636-0.237-11.286,0.341-16.844,1.784c-16.619,4.319-30.412,16.08-38.793,32.534 c-5.158,0.706-10.158,2.168-14.867,4.37c-15.33,7.167-26.414,21.732-30.413,39.961c-3.377,15.399-1.606,32.348,4.966,48.114 c0.262,5.447,0.648,17.885,0.915,28.511c0.272,10.847,9.144,19.498,19.994,19.498h219.353c10.851,0,19.722-8.651,19.994-19.498 c0.267-10.626,0.653-23.064,0.916-28.51C275.808,153.519,277.578,136.573,274.201,121.176z M81.162,168.025L66.87,189.41 c-0.763,1.142-2.046,1.828-3.42,1.828c-1.374,0-2.657-0.686-3.42-1.828l-14.293-21.385c-1.477-2.21-1.477-5.092,0-7.302 l14.293-21.385c0.763-1.142,2.046-1.828,3.42-1.828c1.374,0,2.657,0.686,3.42,1.828l14.293,21.385 C82.639,162.933,82.639,165.815,81.162,168.025z M156.362,132.025l-14.293,21.385c-0.763,1.142-2.046,1.828-3.42,1.828 c-1.374,0-2.657-0.686-3.42-1.828l-14.293-21.385c-1.477-2.21-1.477-5.092,0-7.302l14.293-21.385 c0.763-1.142,2.046-1.828,3.42-1.828c1.374,0,2.657,0.686,3.42,1.828l14.293,21.385 C157.839,126.933,157.839,129.815,156.362,132.025z M231.561,168.025l-14.293,21.385c-0.763,1.142-2.046,1.828-3.42,1.828 s-2.657-0.686-3.42-1.828l-14.293-21.385c-1.477-2.21-1.477-5.092,0-7.302l14.293-21.385c0.763-1.142,2.046-1.828,3.42-1.828 s2.657,0.686,3.42,1.828l14.293,21.385C233.038,162.933,233.038,165.815,231.561,168.025z" />
    </svg>
  ),
};
