import { IconsMapProps } from "../../utils/types/commonTypes";

type IconCreatorProps = IconsMapProps;

function IconCreator({ icons, iconName, iconClass, color, active }: IconCreatorProps): JSX.Element {
  if (iconName === "") return <></>;

  try {
    const icon = icons[iconName](iconClass, color, active);
    return icon !== null ? icon : <>i</>;
  } catch (err) {
    console.error(`Error creating ${iconName} icon.`);
  }

  return <>i</>;
}

export default IconCreator;
