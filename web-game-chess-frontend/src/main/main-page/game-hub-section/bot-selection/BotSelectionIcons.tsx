import { ElementClass, IconMap } from "../../../../shared/utils/types/commonTypes";

type IconNames = "engine";

export const botSelectionIocns: IconMap<IconNames> = {
  engine: (iconClass?: ElementClass) => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      className={iconClass}
    >
      <path d="M23,25H9c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h14c1.1,0,2,0.9,2,2v14C25,24.1,24.1,25,23,25z" />
      <path d="M19,21h-6c-1.1,0-2-0.9-2-2v-6c0-1.1,0.9-2,2-2h6c1.1,0,2,0.9,2,2v6C21,20.1,20.1,21,19,21z" />

      {/* top y1=3 */}
      <line x1="14" y1="1" x2="14" y2="7" />
      <line x1="10" y1="5" x2="10" y2="7" />
      <line x1="22" y1="3" x2="22" y2="7" />
      <line x1="18" y1="4" x2="18" y2="7" />

      {/* bottom y2=29 */}
      <line x1="14" y1="25" x2="14" y2="27" />
      <line x1="10" y1="25" x2="10" y2="30" />
      <line x1="22" y1="25" x2="22" y2="28" />
      <line x1="18" y1="25" x2="18" y2="29" />

      {/* x2=29 */}
      <line x1="25" y1="18" x2="27" y2="18" />
      <line x1="25" y1="22" x2="28" y2="22" />
      <line x1="25" y1="10" x2="28" y2="10" />
      <line x1="25" y1="14" x2="29" y2="14" />

      {/* x1=7 */}
      <line x1="2" y1="18" x2="7" y2="18" />
      <line x1="3" y1="22" x2="7" y2="22" />
      <line x1="4" y1="10" x2="7" y2="10" />
      <line x1="3" y1="14" x2="7" y2="14" />
    </svg>
  ),
};
