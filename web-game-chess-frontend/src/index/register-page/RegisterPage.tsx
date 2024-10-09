import { useEffect, useRef, useState } from "react";
import classes from "./RegisterPage.module.scss";
import SignUpModal from "./register-modals/SignUpModal";
import SignInModal from "./register-modals/SignInModal";
import { useLocation, useNavigate } from "react-router-dom";
import { mainColor } from "../../shared/utils/objects/colorMaps";
import ActionButton from "../../shared/components/action-button/ActionButton";
import VerifyEmailModal from "./register-modals/VerifyEmailModal";
import { RegistrationInterface, StateWithRegOption } from "../../shared/utils/objects/interfacesEnums";
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
  const formRef = useRef<HTMLDivElement>(null);

  // current modal and side class
  const [modal, setModal] = useState<number>(0);
  const [modalClass, setModalClass] = useState<string | null>(null);
  const [formActive, setFormActive] = useState<boolean>(false);

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
        return <SignInModal setModal={setModal} userPath={userPath} />;
      case RegistrationInterface.signUp:
        return <SignUpModal setModal={setModal} />;
      case RegistrationInterface.verify:
        return <VerifyEmailModal setModal={setModal} userPath={userPath} />;
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

    return classes["static-form"];
  };

  useEffect(() => {
    const handleRegisterPageResize = () => {
      setModalClass(getFormClass());
    };

    window.addEventListener("resize", handleRegisterPageResize);
    handleRegisterPageResize();

    return () => {
      window.removeEventListener("resize", handleRegisterPageResize);
    };
  }, [modal]);

  useEffect(() => {
    const addFormTransform = () => {
      const formEle = formRef.current;

      if (formEle) {
        setFormActive(true);
      }
    };

    setTimeout(() => {
      addFormTransform();
    }, 300);
  }, []);
  //*/

  if (!modalClass) return <></>;

  return (
    <main className={classes.register}>
      <div ref={registerRef} className={classes.register__content}>
        {/* intro */}

        <div
          className={`
            ${classes.register__content__intro}
            ${modal !== RegistrationInterface.signIn && classes.active}
          `}
        >
          <h1 className={classes["title"]}>Get on Board</h1>

          <p className={classes["text"]}>
            Join us today to unlock a world of benefits! Create an account to access exclusive content, connect with a
            vibrant community, and get personalized recommendations.
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

        <div className={classes["div-placeholder"]} />

        <div
          className={`
            ${classes.register__content__intro}
            ${modal === RegistrationInterface.signIn && classes.active}
          `}
        >
          <h1 className={classes["title"]}>Welcome Back</h1>

          <p className={classes["text"]}>
            We're thrilled to see you again! Sign in to access your personalized dashboard, manage your preferences, and
            stay updated with the latest features and updates.
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
        {/* --- */}

        {/* form */}
        <div
          ref={formRef}
          data-testid="register-form-container"
          className={`
            ${classes.register__form}
            ${formActive && classes["form-transform"]}
            ${modalClass}
          `}
        >
          <IconCreator
            icons={registerPageIcons}
            iconName={"lock"}
            color={mainColor.c7}
            iconClass={classes["lock-svg"]}
          />

          {renderModal()}
        </div>
        {/* --- */}
      </div>

      <MainPopUp />
    </main>
  );
}

export default RegisterPage;
