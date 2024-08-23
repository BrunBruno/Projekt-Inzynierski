import { useEffect } from "react";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import classes from "./MainPage.module.scss";
import GameSection from "./game-section/GameSection";
import { useLocation } from "react-router-dom";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { PopupType } from "../../shared/utils/types/commonTypes";

function MainPage() {
  ///

  const location = useLocation();
  const { showPopup } = usePopup();

  // to display main page popups
  useEffect(() => {
    if (location.state) {
      const state = location.state as PopupType;

      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, [location.state]);
  //*/

  return (
    <main className={classes.main}>
      <MainNav />

      <GameSection />

      <MainPopUp />
    </main>
  );
}

export default MainPage;
