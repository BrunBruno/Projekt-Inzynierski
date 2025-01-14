import { useEffect, useRef, useState } from "react";
import classes from "./RegisterPage.module.scss";
import SignUpModal from "./register-modals/SignUpModal";
import SignInModal from "./register-modals/SignInModal";
import { useLocation, useNavigate } from "react-router-dom";
import { mainColor } from "../../shared/utils/objects/colorMaps";
import ActionButton from "../../shared/components/action-button/ActionButton";
import VerifyEmailModal from "./register-modals/VerifyEmailModal";
import { StateOptions, RegistrationInterface } from "../../shared/utils/objects/interfacesEnums";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import IconCreator from "../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "./RegisterPageIcons";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { GetRegisterConfModel } from "../../shared/utils/types/userModels";
import { GetRegisterConfDto } from "../../shared/utils/types/userDtos";
import axios from "axios";
import { DataConfiguration } from "../../shared/utils/objects/entitiesEnums";
import { userController } from "../../shared/utils/services/ApiService";
import { getErrMessage } from "../../shared/utils/functions/errors";
import ResetPasswordModal from "./register-modals/ResetPasswordModal";

function RegisterPage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // register container ref
  const registerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // current modal and side class
  const [modal, setModal] = useState<RegistrationInterface>(RegistrationInterface.signIn);
  const [modalClass, setModalClass] = useState<string | null>(null);
  const [formActive, setFormActive] = useState<boolean>(false);

  // url if user provided link
  const [userPath, setUserPath] = useState<string>("/main");

  // user name configuration
  const [userNameConf, setUserNameConf] = useState<GetRegisterConfDto | null>(null);
  // password configuration
  const [userPassConf, setUserPassConf] = useState<GetRegisterConfDto | null>(null);

  // to display main page popups
  // to set form modal if provided
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }

    if (locationState.regOption) {
      setModal(locationState.regOption);
    } else {
      setModal(RegistrationInterface.signIn);
    }

    if (locationState.path) {
      setUserPath(locationState.path);
    }
  }, [location.state]);

  // to set form modal
  const renderModal = (): JSX.Element => {
    switch (modal) {
      case RegistrationInterface.signIn:
        return <SignInModal setModal={setModal} userPath={userPath} />;
      case RegistrationInterface.signUp:
        return <SignUpModal setModal={setModal} userNameConf={userNameConf} userPassConf={userPassConf} />;
      case RegistrationInterface.verify:
        return <VerifyEmailModal setModal={setModal} userPath={userPath} />;
      case RegistrationInterface.reset:
        return <ResetPasswordModal setModal={setModal} userPath={userPath} userPassConf={userPassConf} />;
      default:
        return <></>;
    }
  };

  // to set right class of form
  // sets class based on selected interface and size of window
  const getFormClass = (): string => {
    if (window.innerWidth > 500) {
      switch (modal) {
        case RegistrationInterface.signIn:
          return classes["left-side-form"];
        case RegistrationInterface.reset:
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

  // handle page resize
  useEffect(() => {
    const handleRegisterPageResize = (): void => {
      setModalClass(getFormClass());
    };

    window.addEventListener("resize", handleRegisterPageResize);
    handleRegisterPageResize();

    return () => {
      window.removeEventListener("resize", handleRegisterPageResize);
    };
  }, [modal]);

  useEffect(() => {
    const addFormTransform = (): void => {
      const formEle = formRef.current;

      if (formEle) setFormActive(true);
    };

    setTimeout(() => {
      addFormTransform();
    }, 300);
  }, []);

  // to get register configuration
  useEffect(() => {
    const getDataConfiguration = async (): Promise<void> => {
      try {
        const userRegisterConf: GetRegisterConfModel = {
          configurationId: DataConfiguration.userName,
        };

        // get username configuration
        const userNameConfResp = await axios.get<GetRegisterConfDto>(userController.getRegisterConf(userRegisterConf));

        setUserNameConf(userNameConfResp.data);

        const passwordRegisterConf: GetRegisterConfModel = {
          configurationId: DataConfiguration.userPassword,
        };

        // get password configuration
        const userPassConfResp = await axios.get<GetRegisterConfDto>(
          userController.getRegisterConf(passwordRegisterConf)
        );

        setUserPassConf(userPassConfResp.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getDataConfiguration();
  }, []);

  if (!modalClass) return <></>;

  return (
    <main data-testid="main-register-page" className={classes.register}>
      <div ref={registerRef} className={classes.register__content}>
        {/* intro */}

        <div
          className={`
            ${classes.register__content__intro}
            ${(modal === RegistrationInterface.signUp || modal === RegistrationInterface.verify) && classes.active}
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
            ${(modal === RegistrationInterface.signIn || modal === RegistrationInterface.reset) && classes.active}
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
      </div>

      <MainPopUp />
    </main>
  );
}

export default RegisterPage;
