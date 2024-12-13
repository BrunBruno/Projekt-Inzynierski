import { mainColor } from "../../utils/objects/colorMaps";
import { IconSvgProps } from "../../utils/types/commonTypes";
import classes from "./VsIcons.module.scss";

function VsIcon({ iconClass }: IconSvgProps): JSX.Element {
  return (
    <div className={`${iconClass} ${classes["icon"]}`}>
      <svg
        viewBox="0 0 20 20"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={classes["board-svg"]}
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-220.000000, -2719.000000)" fill={mainColor.c0}>
            <g transform="translate(56.000000, 160.000000)">
              <path d="M174,2573 L178,2573 L178,2569 L174,2569 L174,2573 Z M170,2569 L174,2569 L174,2565 L170,2565 L170,2569 Z M182,2565 L178,2565 L178,2569 L182,2569 L182,2573 L178,2573 L178,2577 L174,2577 L174,2573 L170,2573 L170,2577 L167,2577 C166.448,2577 166,2576.657 166,2576.105 L166,2573 L170,2573 L170,2569 L166,2569 L166,2565 L170,2565 L170,2561 L174,2561 L174,2565 L178,2565 L178,2561 L181,2561 C181.552,2561 182,2561.552 182,2562.105 L182,2565 Z M182,2559 L166,2559 C164.895,2559 164,2559.895 164,2561 L164,2577 C164,2578.104 164.895,2579 166,2579 L182,2579 C183.105,2579 184,2578.104 184,2577 L184,2561 C184,2559.895 183.105,2559 182,2559 L182,2559 Z" />
            </g>
          </g>
        </g>
      </svg>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes["vs-svg"]}>
        <path d="M3 0L6.58579 3.58579L3.58579 6.58579L0 3V0H3Z" fill={mainColor.c5} />
        <path
          d="M6.70711 12.2929L8.20711 13.7929L6.79289 15.2071L4.5 12.9142L2.99771 14.4165C2.99923 14.4441 3 14.472 3 14.5C3 15.3284 2.32843 16 1.5 16C0.671573 16 0 15.3284 0 14.5C0 13.6716 0.671573 13 1.5 13C1.52802 13 1.55586 13.0008 1.5835 13.0023L3.08579 11.5L0.792893 9.20711L2.20711 7.79289L3.70711 9.29289L13 0H16V3L6.70711 12.2929Z"
          fill={mainColor.c5}
        />
        <path
          d="M14.5 16C13.6716 16 13 15.3284 13 14.5C13 14.472 13.0008 14.4441 13.0023 14.4165L10.0858 11.5L13.7929 7.79289L15.2071 9.20711L12.9142 11.5L14.4165 13.0023C14.4441 13.0008 14.472 13 14.5 13C15.3284 13 16 13.6716 16 14.5C16 15.3284 15.3284 16 14.5 16Z"
          fill={mainColor.c5}
        />
      </svg>
    </div>
  );
}

export default VsIcon;
