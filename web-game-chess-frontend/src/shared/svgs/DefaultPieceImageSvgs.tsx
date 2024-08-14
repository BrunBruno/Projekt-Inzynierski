import { mainColor } from "../utils/enums/colorMaps";
import { IconParamMap } from "../utils/types/commonTypes";

const icons: IconParamMap = {
  p: (iconClass: string, color: string) => <></>,

  n: (iconClass: string, color: string) => <></>,

  b: (iconClass: string, color: string) => <></>,

  r: (iconClass: string, color: string) => <></>,

  q: (iconClass: string, color: string) => <></>,

  k: (iconClass: string, color: string) => <></>,
};

type DefaultPieceImagesSvgsProps = {
  iconName: string;
  color: boolean;
};

function DefaultPieceImagesSvgs({ iconName, color }: DefaultPieceImagesSvgsProps) {
  const mc = color ? mainColor.c0 : mainColor.c9;
  const icon = icons[iconName]("", mc);

  return icon ? icon : <>i</>;
}

export default DefaultPieceImagesSvgs;
