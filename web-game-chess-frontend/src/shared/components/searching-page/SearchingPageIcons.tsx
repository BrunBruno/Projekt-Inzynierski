import { ColorValue } from "../../utils/objects/colorMaps";
import { ElementClass, IconMap } from "../../utils/types/commonTypes";
import classes from "./SearchingPage.module.scss";

type IconNames = "pawn" | "globe";

export const searchingPageIcons: IconMap<IconNames> = {
  pawn: (iconClass?: ElementClass, color?: ColorValue, active?: boolean) => (
    <svg
      viewBox="-4 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconClass} ${classes.pawn} ${active ? classes.active : ""}`}
      fill={color}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.9046 8.75004C11.6048 8.01095 12 7.03903 12 5.99989C12 3.79081 10.2092 2 8.0001 2C5.79081 2 4 3.79081 4 5.99989C4 7.03938 4.39551 8.01159 5.09611 8.75076L6.0185 9.72397L2.87982 16.7033C2.29987 17.9929 2 19.3908 2 20.8048V21.9999H14.0015V20.8048C14.0015 19.3908 13.7016 17.9929 13.1217 16.7033L9.9826 9.72322L10.9046 8.75004zM14.9457 15.883C15.6417 17.4305 16.0015 19.108 16.0015 20.8048V21.9999C16.0015 23.1044 15.1061 23.9999 14.0015 23.9999H2C0.89543 23.9999 0 23.1044 0 21.9999V20.8048C0 19.108 0.35984 17.4305 1.05578 15.883L3.64453 10.1266C2.62524 9.05119 2 7.59856 2 5.99989C2 2.68624 4.68624 0 7.9999 0C11.3138 0 14 2.68624 14 5.99989C14 7.59802 13.3752 9.05022 12.3565 10.1255L14.9457 15.883z"
      />
    </svg>
  ),

  globe: (iconClass?: ElementClass, color?: ColorValue, active?: boolean) => (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 96 96"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
      className={`${iconClass} ${active ? classes["active-bg"] : ""}`}
      fill={color}
    >
      <g>
        <path d="M18.521,13.606c2.761-5.293,6.67-9.885,11.397-13.457c-7.757,0.499-14.757,3.76-20.035,8.812 C12.53,10.859,15.427,12.432,18.521,13.606z" />
        <path d="M31,1.832c-4.362,3.322-7.982,7.566-10.573,12.442c3.347,1.069,6.896,1.681,10.573,1.775V1.832z" />
        <path d="M33,1.832V16.05c3.678-0.095,7.227-0.706,10.573-1.775C40.982,9.398,37.362,5.155,33,1.832z" />
        <path d="M45.479,13.606c3.095-1.175,5.99-2.748,8.638-4.646c-5.278-5.051-12.278-8.312-20.035-8.811 C38.809,3.722,42.718,8.313,45.479,13.606z" />
        <path d="M14.025,31.075c0.138-5.582,1.415-10.878,3.613-15.667c-3.292-1.268-6.369-2.962-9.174-5.008 c-5.043,5.473-8.194,12.707-8.439,20.675H14.025z" />
        <path d="M31,18.05c-3.997-0.099-7.848-0.779-11.471-1.968c-2.127,4.577-3.365,9.647-3.504,14.993H31V18.05z" />
        <path d="M33,31.075h14.975c-0.139-5.346-1.377-10.416-3.504-14.993C40.847,17.271,36.997,17.951,33,18.05V31.075z" />
        <path d="M46.361,15.408c2.198,4.789,3.476,10.085,3.613,15.667h14c-0.245-7.968-3.396-15.202-8.439-20.675 C52.73,12.446,49.653,14.141,46.361,15.408z" />
        <path d="M14.025,33.075h-14c0.264,8.559,3.882,16.27,9.592,21.861c2.729-1.848,5.692-3.374,8.846-4.508 C15.762,45.209,14.179,39.321,14.025,33.075z" />
        <path d="M31,33.075H16.025c0.156,6.027,1.711,11.705,4.359,16.719c3.371-1.021,6.932-1.603,10.615-1.693V33.075z" />
        <path d="M47.975,33.075H33v15.025c3.684,0.091,7.244,0.672,10.615,1.693C46.264,44.78,47.818,39.103,47.975,33.075z" />
        <path d="M49.975,33.075c-0.153,6.246-1.736,12.134-4.438,17.354c3.153,1.134,6.117,2.66,8.846,4.508 c5.71-5.592,9.328-13.303,9.592-21.861H49.975z" />
        <path d="M19.441,52.209c-2.953,1.034-5.734,2.429-8.304,4.119c5.11,4.4,11.623,7.212,18.779,7.672 C25.692,60.809,22.124,56.802,19.441,52.209z" />
        <path d="M31,62.318V50.101c-3.327,0.086-6.548,0.598-9.609,1.486C23.887,55.749,27.156,59.391,31,62.318z" />
        <path d="M33,62.318c3.844-2.929,7.113-6.569,9.609-10.731c-3.062-0.889-6.282-1.4-9.609-1.486V62.318z" />
        <path d="M44.559,52.21c-2.683,4.592-6.251,8.599-10.476,11.79c7.156-0.46,13.668-3.271,18.778-7.671 C50.293,54.639,47.512,53.244,44.559,52.21z" />
      </g>
    </svg>
  ),
};
