import { useEffect, useState } from "react";
import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import classes from "./MainPage.module.scss";
import GameHubSection from "./game-hub-section/GameHubSection";
import { useLocation } from "react-router-dom";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { StateOptions } from "../../shared/utils/objects/interfacesEnums";

function MainPage() {
  ///

  const location = useLocation();
  const { showPopup } = usePopup();

  const [providedInterface, setProvidedInterface] = useState<number | null>(null);

  // to display main page popups
  // to set interface content if provided
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }

    if (locationState.interface) {
      setProvidedInterface(locationState.interface);
    }
  }, [location.state]);
  //*/

  //*/

  return (
    <main data-testid="main-main-page" className={classes.main}>
      <MainNav />

      <GameHubSection providedInterface={providedInterface} />

      <MainPopUp />
    </main>
  );
}

export default MainPage;
