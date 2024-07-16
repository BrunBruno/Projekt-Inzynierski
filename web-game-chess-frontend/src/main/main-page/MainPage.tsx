import MainNav from "../../shared/components/main-nav/MainNav";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import classes from "./MainPage.module.scss";
import GameSection from "./game-section/GameSection";

function MainPage() {
  return (
    <main className={classes.main}>
      <MainNav />
      <GameSection />

      <MainPopUp />
    </main>
  );
}

export default MainPage;
