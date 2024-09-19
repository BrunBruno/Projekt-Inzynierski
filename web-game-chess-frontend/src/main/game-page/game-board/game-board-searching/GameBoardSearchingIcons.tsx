import { IconMap } from "../../../../shared/utils/types/commonTypes";
import classes from "./GameBoardSearching.module.scss";

type IconNames = "pawn";

export const gameBoardSearchingIcons: IconMap<IconNames> = {
  pawn: (iconClass?: string | undefined, color?: string | undefined, active?: boolean | undefined) => (
    <svg
      viewBox="-4 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconClass} ${classes.pawn} ${active ? classes.active : ""}`}
    >
      <path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.9046 8.75004C11.6048 8.01095 12 7.03903 12 5.99989C12 3.79081 10.2092 2 8.0001 2C5.79081 2 4 3.79081 4 5.99989C4 7.03938 4.39551 8.01159 5.09611 8.75076L6.0185 9.72397L2.87982 16.7033C2.29987 17.9929 2 19.3908 2 20.8048V21.9999H14.0015V20.8048C14.0015 19.3908 13.7016 17.9929 13.1217 16.7033L9.9826 9.72322L10.9046 8.75004zM14.9457 15.883C15.6417 17.4305 16.0015 19.108 16.0015 20.8048V21.9999C16.0015 23.1044 15.1061 23.9999 14.0015 23.9999H2C0.89543 23.9999 0 23.1044 0 21.9999V20.8048C0 19.108 0.35984 17.4305 1.05578 15.883L3.64453 10.1266C2.62524 9.05119 2 7.59856 2 5.99989C2 2.68624 4.68624 0 7.9999 0C11.3138 0 14 2.68624 14 5.99989C14 7.59802 13.3752 9.05022 12.3565 10.1255L14.9457 15.883z"
      />
    </svg>
  ),
};
