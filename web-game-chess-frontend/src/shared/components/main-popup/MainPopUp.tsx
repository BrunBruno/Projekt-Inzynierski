import { useLocation } from "react-router-dom";
import classes from "./MainPopUp.module.scss";
import { useEffect, useState } from "react";

type MainPopUpProps = {};

function MainPopUp({}: MainPopUpProps) {
  const location = useLocation();

  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.popup) {
      setContent(location.state.popup);

      delete location.state.popup;

      window.history.replaceState(location.state, "", location.pathname);
    }
  }, [location.state]);

  //   if (!content) return <></>;

  //   return <div className={classes.popup}>{content}</div>;
  return (
    <div className={classes.popup}>
      <div className={classes.popup__icon}></div>
      <div className={classes.popup__text}>Invitaation sent. {content}</div>
    </div>
  );
}

export default MainPopUp;
