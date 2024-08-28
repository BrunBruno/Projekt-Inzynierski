import { IconsMapProps } from "../../utils/types/commonTypes";

type IconCreatorProps = IconsMapProps;

function IconCreator({ icons, iconName }: IconCreatorProps): JSX.Element {
  if (iconName === "") return <></>;

  try {
    const icon = icons[iconName];
    return icon !== null ? icon : <>i</>;
  } catch (err) {
    console.error("Icon error");
  }

  return <>i</>;
}

export default IconCreator;
