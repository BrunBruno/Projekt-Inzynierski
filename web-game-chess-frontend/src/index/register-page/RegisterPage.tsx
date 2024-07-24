import { useEffect, useState } from "react";
import classes from "./RegisterPage.module.scss";
import SignUp from "./modals/SignUp";
import SignIn from "./modals/SignIn";
import PasswordIconSvg from "../../shared/svgs/PasswordIconSvg";
import { useLocation, useNavigate } from "react-router-dom";
import { mainColor } from "../../shared/utils/enums/colorMaps";
import ActionButton from "../../shared/components/action-button/ActionButton";
import VerifyEmail from "./modals/VerifyEmail";
import { registrationInterface } from "../../shared/utils/enums/interfacesEnums";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";

function RegisterPage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  // React node modal set to be displayed
  const [modal, setModal] = useState<number>(0);

  useEffect(() => {
    if (location.state && location.state.regOption) {
      setModal(location.state.regOption);
    } else {
      setModal(registrationInterface.signIn);
    }
  }, [location]);

  // set form modal
  const renderModal = (): JSX.Element => {
    switch (modal) {
      case registrationInterface.signIn:
        return <SignIn setModal={setModal} />;
      case registrationInterface.signUp:
        return <SignUp setModal={setModal} />;
      case registrationInterface.verify:
        return <VerifyEmail setModal={setModal} />;
      default:
        return <></>;
    }
  };

  // get form class
  const getFormClass = (): string => {
    switch (modal) {
      case registrationInterface.signIn:
        return classes["left-side-form"];
      case registrationInterface.signUp:
        return classes["right-side-form"];
      case registrationInterface.verify:
        return classes["right-side-form"];
      default:
        return "";
    }
  };

  return (
    <main className={classes.register}>
      <div className={classes.register__content}>
        {modal === registrationInterface.signIn ? (
          <div className={`${classes.register__content__split} ${classes["left-side-content"]}`}>
            <div className={classes.form}></div>
            <div className={classes.intro}>
              <h1 className={classes.title}>Welcome Back</h1>
              <p className={classes.text}>
                We're thrilled to see you again! Sign in to access your personalized dashboard, manage your preferences,
                and stay updated with the latest features and updates.
              </p>
              <div
                className={classes["action-button"]}
                onClick={() => {
                  navigate("/");
                }}
              >
                <ActionButton text="Home Page" />
              </div>
            </div>
          </div>
        ) : (
          <div className={`${classes.register__content__split} ${classes["right-side-content"]}`}>
            <div className={classes.intro}>
              <h1 className={classes.title}>Get on Board</h1>
              <p className={classes.text}>
                Join us today to unlock a world of benefits! Create an account to access exclusive content, connect with
                a vibrant community, and get personalized recommendations.
              </p>
              <div
                className={classes["action-button"]}
                onClick={() => {
                  navigate("/");
                }}
              >
                <ActionButton text="Home Page" />
              </div>
            </div>
            <div className={classes.form}></div>
          </div>
        )}

        <div className={`${classes.register__content__form} ${getFormClass()}`}>
          <PasswordIconSvg color={mainColor.c7} iconClass={classes["lock-svg"]} />
          {renderModal()}
        </div>
      </div>

      <MainPopUp />
    </main>
  );
}

export default RegisterPage;
