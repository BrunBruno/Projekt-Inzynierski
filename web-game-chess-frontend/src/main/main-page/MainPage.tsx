import MainNav from "../../shared/components/main-nav/MainNav";
import classes from "./MainPage.module.scss";
import GameSection from "./game-section/GameSection";

function MainPage() {
  return (
    <main className={classes.main}>
      <MainNav />
      <GameSection />
    </main>
  );
}

export default MainPage;
