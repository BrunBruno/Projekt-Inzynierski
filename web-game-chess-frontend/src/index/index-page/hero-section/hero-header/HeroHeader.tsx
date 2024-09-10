import { useNavigate } from "react-router-dom";
import classes from "./HeroHeader.module.scss";
import LogoIcon from "../../../../shared/svgs/icons/LogoIcon";
import { RegistrationInterface } from "../../../../shared/utils/enums/interfacesEnums";

type HeroHeaderProps = {};

function HeroHeader({}: HeroHeaderProps) {
  ///

  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      {/* logo */}
      <div className={classes.header__logo}>
        <a href="/" className={classes["logo-reload"]}>
          <LogoIcon iconClass={classes["logo-svg"]} />
        </a>
        <p className={classes["logo-text"]}>Chess</p>
      </div>
      {/* --- */}

      {/* action buttons */}
      <div className={classes.header__actions}>
        <button
          className={classes["hero-button"]}
          onClick={() => {
            navigate("/about/introduction");
          }}
        >
          <span>About</span>
        </button>

        <button
          className={classes["hero-button"]}
          onClick={() => {
            navigate("/registration", {
              state: { regOption: RegistrationInterface.signIn },
            });
          }}
        >
          <span>Sign In</span>
        </button>

        <button
          className={classes["hero-button"]}
          onClick={() => {
            navigate("/registration", {
              state: { regOption: RegistrationInterface.signUp },
            });
          }}
        >
          <span>Sign Up</span>
        </button>
      </div>
      {/* --- */}
    </header>
  );
}

export default HeroHeader;
