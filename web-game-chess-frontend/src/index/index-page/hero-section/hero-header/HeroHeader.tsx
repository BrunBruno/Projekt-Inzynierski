import { useNavigate } from "react-router-dom";
import classes from "./HeroHeader.module.scss";
import LogoIcon from "../../../../shared/svgs/icons/LogoIcon";
import { RegistrationInterface, StateOptions } from "../../../../shared/utils/objects/interfacesEnums";

type HeroHeaderProps = {};

function HeroHeader({}: HeroHeaderProps) {
  ///

  const navigate = useNavigate();

  // to open registration page
  const navigateToRegistration = (regOption: RegistrationInterface): void => {
    const state: StateOptions = {
      regOption: regOption,
    };

    navigate("/registration", { state: state });
  };

  return (
    <header className={classes.header}>
      {/* logo */}
      <div className={classes.header__logo}>
        <a href="/" className={classes["logo-reload"]}>
          <LogoIcon iconClass={classes["logo-svg"]} />
        </a>
        <p className={classes["logo-text"]}>Chess</p>
      </div>

      {/* action buttons */}
      <div className={classes.header__actions}>
        <button
          data-testid="hero-button-about"
          className={classes["hero-button"]}
          onClick={() => {
            navigate("/about/introduction");
          }}
        >
          <span>About</span>
        </button>

        <button
          data-testid="hero-button-sign-in"
          className={classes["hero-button"]}
          onClick={() => {
            navigateToRegistration(RegistrationInterface.signIn);
          }}
        >
          <span>Sign In</span>
        </button>

        <button
          data-testid="hero-button-sign-up"
          className={classes["hero-button"]}
          onClick={() => {
            navigateToRegistration(RegistrationInterface.signUp);
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
