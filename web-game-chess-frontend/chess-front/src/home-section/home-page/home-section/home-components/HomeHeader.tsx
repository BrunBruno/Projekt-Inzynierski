import { useNavigate } from "react-router-dom";
import classes from "./HomeHeader.module.scss";
import { registrationActionEnum } from "../../../../shared/utils/enums/registrationAction";
import LogoIconSvg from "../../../../shared/svgs/LogoIconSvg";

function HomeHeader() {
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <div className={classes["nav-logo"]}>
        <a href="/">
          <LogoIconSvg iconClass={classes["logo-svg"]} />
        </a>
        <p>Chess</p>
      </div>

      <div className={classes["nav-actions"]}>
        <button
          className={classes["nav-button"]}
          onClick={() => {
            navigate("/about");
          }}
        >
          <span>About</span>
        </button>
        <button
          className={classes["nav-button"]}
          onClick={() => {
            navigate("/registration", {
              state: { regOption: registrationActionEnum.signIn },
            });
          }}
        >
          <span>Sign In</span>
        </button>
        <button
          className={classes["nav-button"]}
          onClick={() => {
            navigate("/registration", {
              state: { regOption: registrationActionEnum.signUp },
            });
          }}
        >
          <span>Sign Up</span>
        </button>
      </div>
    </header>
  );
}

export default HomeHeader;
