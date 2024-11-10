import classes from "./RankingPage.module.scss";
import TableSection from "./table-section/TableSection";

function RankingPage() {
  ///

  return (
    <main className={classes["ranking-main"]}>
      <div className={classes["ranking"]}>
        <TableSection />
      </div>
    </main>
  );
}

export default RankingPage;
