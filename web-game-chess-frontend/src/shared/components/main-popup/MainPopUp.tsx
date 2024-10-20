import classes from "./MainPopUp.module.scss";
import { usePopup } from "../../utils/hooks/usePopUp";
import { useEffect } from "react";
import IconCreator from "../icon-creator/IconCreator";
import { symbolIcons } from "../../svgs/iconsMap/SymbolIcons";

function MainPopUp(): JSX.Element {
  ///

  const { popupContent, popupType, hidePopup } = usePopup();

  // to hide popups after 2 seconds of display
  useEffect(() => {
    const timeout = setTimeout(() => {
      hidePopup();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [popupContent]);
  //*/

  if (!popupType) return <></>;

  return (
    <div className={classes.popup}>
      <div className={classes.popup__icon}>
        <IconCreator icons={symbolIcons} iconName={popupType} />
      </div>

      <div className={classes.popup__text}>
        <span>{popupContent.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default MainPopUp;
