import { symbolIcons } from "../../svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../utils/enums/colorMaps";
import IconCreator from "../icon-creator/IconCreator";
import classes from "./ActionButton.module.scss";

type ActionButtonProps = {
  // text in button
  text: string;
};

const ActionButton = ({ text }: ActionButtonProps): JSX.Element => {
  ///

  return (
    <button className={classes["action-button"]}>
      <span>{text}</span>
      <IconCreator icons={symbolIcons} iconName={"arrow"} color={greyColor.c0} iconClass={classes["button-arrow"]} />
    </button>
  );
};

export default ActionButton;
