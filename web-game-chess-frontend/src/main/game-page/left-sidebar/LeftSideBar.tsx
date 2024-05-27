import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import classes from "./LeftSideBar.module.scss";

function LeftSideBar() {
  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        <div
          className={classes.bar__content__logo}
          onClick={() => {
            location.reload();
          }}
        >
          <LogoIconSvg iconClass={classes["logo-svg"]} />
          <p>Chess</p>
        </div>
        <ul className={classes.bar__content__list}>
          <li className={classes.bar__content__list__element}>Some Option</li>
          <li className={classes.bar__content__list__element}>Some Option</li>
          <li className={classes.bar__content__list__element}>Some Option</li>
          <li className={classes.bar__content__list__element}>Some Option</li>
          <li className={classes.bar__content__list__element}>Some Option</li>
          <li className={classes.bar__content__list__element}>Some Option</li>
        </ul>
      </div>
    </section>
  );
}

export default LeftSideBar;
