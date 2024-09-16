import { useEffect, useState } from "react";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import classes from "./MainPage.module.scss";
import GameHubSection from "./game-hub-section/GameHubSection";
import { useLocation } from "react-router-dom";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { PopupType } from "../../shared/utils/types/commonTypes";
import { StateWithSearchInterface } from "../../shared/utils/enums/interfacesEnums";

function MainPage() {
  ///

  const location = useLocation();
  const { showPopup } = usePopup();

  const [providedInterface, setProvidedInterface] = useState<number | null>(null);

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

  // to set content
  useEffect(() => {
    if (location.state) {
      const state = location.state as StateWithSearchInterface;

      if (state.interface) {
        setProvidedInterface(state.interface);
      }
    }
  }, [location.state]);
  //*/

  return (
    <main className={classes.main}>
      <MainNav />

      <GameHubSection providedInterface={providedInterface} />

      <MainPopUp />
    </main>
  );
}

export default MainPage;
