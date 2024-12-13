import MainNav from "../../shared/components/main-nav/MainNav";
import classes from "./RankingPage.module.scss";
import TableSection from "./table-section/TableSection";

function RankingPage() {
  ///

  return (
    <main data-testid="main-ranking-page" className={classes["ranking-main"]}>
      <div className={classes["ranking"]}>
        <TableSection />
      </div>

      <MainNav />
    </main>
  );
}

export default RankingPage;
