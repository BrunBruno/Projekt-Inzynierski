import { useEffect, useRef, useState } from "react";
import classes from "./RegisterPage.module.scss";
import SignUp from "./modals/SignUp";
import SignIn from "./modals/SignIn";
import { useLocation, useNavigate } from "react-router-dom";
import { mainColor } from "../../shared/utils/enums/colorMaps";
import ActionButton from "../../shared/components/action-button/ActionButton";
import VerifyEmail from "./modals/VerifyEmail";
import { RegistrationInterface, StateWithRegOption } from "../../shared/utils/enums/interfacesEnums";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import IconCreator from "../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "./RegisterPageIcons";
import { PopupType } from "../../shared/utils/types/commonTypes";
import { usePopup } from "../../shared/utils/hooks/usePopUp";

function RegisterPage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  const { showPopup } = usePopup();

  // register container ref
  const registerRef = useRef<HTMLDivElement>(null);

  // current modal and side class
  const [modal, setModal] = useState<number>(0);
  const [modalClass, setModalClass] = useState<string>("");

  const [userPath, setUserPath] = useState<string>("/main");

  // to display main page popups
  useEffect(() => {
    if (location.state) {
      const state = location.state as PopupType;

      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, [location.state]);
  //*/

  // to set form modal
  useEffect(() => {
    const state = location.state as StateWithRegOption;

    if (state) {
      if (state.regOption) {
        setModal(state.regOption);
      } else {
        setModal(RegistrationInterface.signIn);
      }

      if (state.path) {
        setUserPath(state.path);
      }
    }
  }, [location.state]);

  const renderModal = (): JSX.Element => {
    switch (modal) {
      case RegistrationInterface.signIn:
        return <SignIn setModal={setModal} userPath={userPath} />;
      case RegistrationInterface.signUp:
        return <SignUp setModal={setModal} />;
      case RegistrationInterface.verify:
        return <VerifyEmail setModal={setModal} userPath={userPath} />;
      default:
        return <></>;
    }
  };
  //*/

  // to set right class of form
  // sets class based on selected interface and size of window
  const getFormClass = (): string => {
    if (window.innerWidth > 500) {
      switch (modal) {
        case RegistrationInterface.signIn:
          return classes["left-side-form"];
        case RegistrationInterface.signUp:
          return classes["right-side-form"];
        case RegistrationInterface.verify:
          return classes["right-side-form"];
        default:
          return "";
      }
    }
    return "";
  };

  useEffect(() => {
    const handleResize = () => {
      setModalClass(getFormClass());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modal]);
  //*/

  return (
    <main className={classes.register}>
      <div ref={registerRef} className={classes.register__content}>
        {/* intro */}
        {modal === RegistrationInterface.signIn ? (
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
        {/* --- */}

        {/* form */}
        <div className={`${classes.register__content__form} ${modalClass}`}>
          <IconCreator icons={registerPageIcons} iconName="lock" color={mainColor.c7} iconClass={classes["lock-svg"]} />
          {renderModal()}
        </div>
        {/* --- */}
      </div>

      <MainPopUp />
    </main>
  );
}

export default RegisterPage;
