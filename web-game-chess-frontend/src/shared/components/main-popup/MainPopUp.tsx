import classes from "./MainPopUp.module.scss";
import { usePopup } from "../../utils/hooks/usePopUp";
import MainPopUpIcons from "./MainPopUpIcons";
import { useEffect } from "react";

type MainPopUpProps = {};

function MainPopUp({}: MainPopUpProps) {
  const { popupContent, popupType, hidePopup } = usePopup();

  useEffect(() => {
    const timeout = setTimeout(() => {
      hidePopup();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [popupContent]);

  if (!popupType) return <></>;

  return (
    <div className={classes.popup}>
      <div className={classes.popup__icon}>
        <MainPopUpIcons iconName={popupType} />
      </div>
      <div className={classes.popup__text}>{popupContent}</div>
    </div>
  );
}

export default MainPopUp;
