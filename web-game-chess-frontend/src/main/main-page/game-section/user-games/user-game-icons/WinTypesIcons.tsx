import {
  IconMap,
  IconsMapProps,
} from "../../../../../shared/utils/types/commonTypes";

const icons: IconMap = {
  checkmate: <p>#</p>,
  outoftime: <p>00:00</p>,
  resignation: <p>P</p>,
  stalemate: <p>=</p>,
  threefold: <p>3</p>,
  agreement: <p>{"><"}</p>,
  fiftymovesrule: <p>50</p>,
  insufficientmaterial: <p>x</p>,
};

function WinTypesIocns({ iconName }: IconsMapProps) {
  const icon = icons[iconName];

  return icon ? icon : <></>;
}

export default WinTypesIocns;
