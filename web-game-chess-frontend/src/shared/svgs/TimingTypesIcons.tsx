import { mainColor } from "../utils/enums/colorMaps";
import { IconParamMap } from "../utils/types/commonTypes";

const icons: IconParamMap = {
  bullet: (iconClass: string, color: string): JSX.Element => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      className={iconClass}
      style={{ transform: "rotate(45deg)" }}
    >
      <g>
        <path
          d="M376.531,197.984c-0.031-19.719-3.688-41.172-9.844-62.703c-9.281-32.25-24.156-64.484-42.406-89.734 c-9.188-12.609-19.188-23.516-30.375-31.734c-5.625-4.078-11.531-7.5-17.875-9.938C269.719,1.438,262.969,0,256,0 c-9.297,0-18.172,2.563-26.234,6.625c-14.141,7.188-26.328,18.781-37.391,32.75c-16.531,21.031-30.438,47.875-40.563,75.813 c-10.063,27.984-16.297,56.938-16.344,82.797C135.469,263.938,135.5,512,135.5,512h241.031 C376.531,512,376.516,259.875,376.531,197.984z M167.688,479.781c0-0.766,0-1.469,0-2.313c0-11.125,0-28.313,0-53.469h176.625 c0,27.063,0,44.75,0,55.781H167.688z M344.313,391.797H167.688c0-14.266,0-36.734,0-62.328c0-43.625,0-96.125,0-131.484 c-0.016-15.641,3.063-34.609,8.594-53.813c8.234-28.859,22.031-58.422,37.516-79.703c7.703-10.656,15.828-19.203,23.297-24.625 c3.734-2.734,7.281-4.688,10.438-5.906c3.188-1.219,5.953-1.719,8.469-1.719c3.344,0,7.188,0.906,11.75,3.188 c7.938,3.938,17.469,12.313,26.563,23.906c13.719,17.375,26.516,41.656,35.563,66.813c9.125,25.141,14.469,51.313,14.438,71.859 C344.313,254.094,344.313,353.156,344.313,391.797z"
          fill={color}
        />
      </g>
    </svg>
  ),

  blitz: (iconClass: string, color: string): JSX.Element => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <polygon
        points="8.29 1.71 18.5 1.71 13.86 9.14 17.57 9.14 7.36 20.29 9.21 12.86 5.5 12.86 8.29 1.71"
        fill="none"
        strokeWidth="1.5"
        stroke={color}
      />
    </svg>
  ),

  rapid: (iconClass: string, color: string): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M4.51555 7C3.55827 8.4301 3 10.1499 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3V6M12 12L8 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  classic: (iconClass: string, color: string): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  daily: (iconClass: string, color: string): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconClass}>
      <path
        d="M7.28451 10.3333C7.10026 10.8546 7 11.4156 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C11.4156 7 10.8546 7.10026 10.3333 7.28451"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M12 2V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 20V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12L2 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 12L20 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.7778 4.22266L17.5558 6.25424" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.22217 4.22266L6.44418 6.25424" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.44434 17.5557L4.22211 19.7779" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19.7778 19.7773L17.5558 17.5551" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

type TimingTypesIconsProps = {
  iconName: string;
  iconClass: string;
  color?: string;
};

function TimingTypesIcons({ iconName, iconClass, color = mainColor.c5 }: TimingTypesIconsProps) {
  if (iconName === "") return <>i</>;

  try {
    const icon = icons[iconName](iconClass, color);
    return icon ? icon : <>i</>;
  } catch (err) {
    console.error("Icon error");
  }

  return <>i</>;
}

export default TimingTypesIcons;
