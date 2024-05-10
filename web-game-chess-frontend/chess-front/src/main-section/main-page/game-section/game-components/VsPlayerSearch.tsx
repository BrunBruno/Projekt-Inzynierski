import classes from "./VsPlayerSearch.module.scss";

function VsPlayerSearch() {
  return (
    <div className={classes.search}>
      <div className={classes.search__grid}>
        <div className={classes.search__grid__header}>Bullet</div>

        <div className={classes.search__grid__block}>1+0</div>
        <div className={classes.search__grid__block}>1+1</div>
        <div className={classes.search__grid__block}>2+0</div>

        <div className={classes.search__grid__header}>Blitz</div>

        <div className={classes.search__grid__block}>3+0</div>
        <div className={classes.search__grid__block}>3+5</div>
        <div className={classes.search__grid__block}>5+0</div>

        <div className={classes.search__grid__header}>Rapid</div>

        <div className={classes.search__grid__block}>10+0</div>
        <div className={classes.search__grid__block}>10+10</div>
        <div className={classes.search__grid__block}>30+0</div>

        <div className={classes.search__grid__header}>Classical</div>

        <div className={classes.search__grid__block}>1h</div>
        <div className={classes.search__grid__block}>2h</div>
        <div className={classes.search__grid__block}>3h</div>

        <div className={classes.search__grid__header}>Daily</div>

        <div className={classes.search__grid__block}>1d</div>
        <div className={classes.search__grid__block}>2d</div>
        <div className={classes.search__grid__block}>7d</div>
      </div>
    </div>
  );
}

export default VsPlayerSearch;
