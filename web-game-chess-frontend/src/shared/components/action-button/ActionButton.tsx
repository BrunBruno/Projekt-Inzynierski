import ArrowRightSvg from "../../svgs/ArrowRightSvg";
import { greyColor } from "../../utils/enums/colorMaps";

type ActionButtonProps = {
  text: string;
};

const ActionButton = ({ text }: ActionButtonProps) => {
  return (
    <button>
      <span>{text}</span>
      <ArrowRightSvg color={greyColor.c0} iconClass="" />
    </button>
  );
};

export default ActionButton;
