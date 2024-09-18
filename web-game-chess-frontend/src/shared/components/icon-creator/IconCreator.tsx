import { ColorValue } from "../../utils/enums/colorMaps";
import { IconMap } from "../../utils/types/commonTypes";

type IconCreatorProps<T extends string> = {
  icons: IconMap<T>;
  iconName: T;
  iconClass?: string;
  color?: ColorValue;
  active?: boolean;
};

function IconCreator<T extends string>({
  icons,
  iconName,
  iconClass,
  color,
  active,
}: IconCreatorProps<T>): JSX.Element {
  if (iconName === "") return <></>;

  try {
    const icon = icons[iconName](iconClass, color, active);
    return icon !== null ? icon : <>i</>;
  } catch (err) {
    console.error(`Error creating ${String(iconName)} icon.`);
  }

  return <>i</>;
}

export default IconCreator;
