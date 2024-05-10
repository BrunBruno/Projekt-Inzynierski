import classes from "./MainPage.module.scss";
import GameSection from "./game-section/GameSection";
import NavSection from "./nav-section/NavSection";

function MainPage() {
  return (
    <main className={classes.main}>
      <NavSection />
      <GameSection />
    </main>
  );
}

export default MainPage;
