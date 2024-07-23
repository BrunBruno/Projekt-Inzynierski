import { useEffect } from "react";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import classes from "./MainPage.module.scss";
import GameSection from "./game-section/GameSection";
import { useLocation } from "react-router-dom";
import { popupIconTypes, usePopup } from "../../shared/utils/hooks/usePopUp";

function MainPage() {
  const location = useLocation();
  const { showPopup } = usePopup();

  useEffect(() => {
    if (location.state) {
      const state = location.state as {
        popupText: string;
        popupType: typeof popupIconTypes[number];
      };

      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, []);

  return (
    <main className={classes.main}>
      <MainNav />

      <GameSection />

      <MainPopUp />
    </main>
  );
}

export default MainPage;
