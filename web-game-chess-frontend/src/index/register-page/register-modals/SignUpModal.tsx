import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { mainColor, strengthColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { errorDisplay, getErrMessage } from "../../../shared/utils/functions/errors";
import { userController } from "../../../shared/utils/services/ApiService";
import { ConfigurationDto, LogInUserDto } from "../../../shared/utils/types/userDtos";
import { RegistrationInterface } from "../../../shared/utils/objects/interfacesEnums";
import { GetRegisterConfModel, LogInUserModel, RegisterUserModel } from "../../../shared/utils/types/userModels";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getCountry } from "../../../shared/utils/functions/externApi";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "../RegisterPageIcons";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { DataConfiguration } from "../../../shared/utils/objects/entitiesEnums";

type SignUpModalProps = {
  // change displayed modal
  setModal: Dispatch<SetStateAction<number>>;
};

function SignUpModal({ setModal }: SignUpModalProps) {
  ///

  // result of input validation
  type ValidationResult = {
    // is input valid
    isValid: boolean;
    // optional message if input is not valid
    message: string;
  };

  const { showPopup } = usePopup();

  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confPassInputRef = useRef<HTMLInputElement>(null);
  // password strength indicator ref
  const indRef = useRef<HTMLSpanElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");
  // user name configuration
  const [userNameConf, setUserNameConf] = useState<ConfigurationDto | null>(null);
  // password configuration
  const [userPassConf, setUserPassConf] = useState<ConfigurationDto | null>(null);
  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // to get register configuration
  useEffect(() => {
    const getDataConfiguration = async (): Promise<void> => {
      try {
        const userRegisterConf: GetRegisterConfModel = {
          configurationId: DataConfiguration.userName,
        };

        // get username configuration
        const userNameConfResp = await axios.get<ConfigurationDto>(userController.getRegisterConf(userRegisterConf));

        setUserNameConf(userNameConfResp.data);

        const passwordRegisterConf: GetRegisterConfModel = {
          configurationId: DataConfiguration.userPassword,
        };

        // get password configuration
        const userPassConfResp = await axios.get<ConfigurationDto>(
          userController.getRegisterConf(passwordRegisterConf)
        );

        setUserPassConf(userPassConfResp.data);

        setProcessing(false);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getDataConfiguration();
  }, []);
  //*/

  // creates user account
  const signUpUser = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (
      userNameConf === null ||
      userPassConf === null ||
      !emailInputRef.current ||
      !usernameInputRef.current ||
      !passwordInputRef.current ||
      !confPassInputRef.current
    ) {
      setErrorMess("Something went wrong.");
      return;
    }

    const country = await getCountry();

    // user data
    const form = event.target as HTMLFormElement;
    const userData: RegisterUserModel = {
      email: form.email.value.trim(),
      username: form.userName.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      country: country === undefined ? "" : country,
    };

    // Check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      emailInputRef.current.classList.add(classes.err);
      setErrorMess("Email is not valid.");
      return;
    }

    // check username with configuration
    const checkUserName: ValidationResult = checkFromConfiguration("UserName", userData.username, userNameConf);

    // verify username
    if (!checkUserName.isValid) {
      usernameInputRef.current.classList.add(classes.err);
      setErrorMess(checkUserName.message);
      return;
    }

    // check for white spaces in password
    if (userData.password.indexOf(" ") >= 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can't contain whitespace.");
      return;
    }

    // check password with configuration
    const checkUserPass: ValidationResult = checkFromConfiguration("Password", userData.password, userPassConf);

    // verify password
    if (!checkUserPass.isValid) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess(checkUserPass.message);
      return;
    }

    // check password match
    if (userData.password !== userData.confirmPassword) {
      confPassInputRef.current.classList.add(classes.err);
      setErrorMess("Passwords don't match.");
      return;
    }

    try {
      setProcessing(true);
      // create account
      await axios.post(userController.registerUser(), userData);

      const logUserData: LogInUserModel = {
        emailOrUsername: form.email.value.trim(),
        password: form.password.value,
      };

      // set temporary user data
      localStorage.setItem("logUserTemp", JSON.stringify(logUserData));

      // login user, get unverified token
      const logInResponse = await axios.post<LogInUserDto>(userController.logInUser(), logUserData);

      // set unverified token
      localStorage.setItem("token", logInResponse.data.token);

      setProcessing(false);

      // change modal to email verification
      setModal(RegistrationInterface.verify);

      showPopup("Account created.", "success");
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);

      setProcessing(false);
    }
  };
  //*/

  // to check user input with db configuration record
  const checkFromConfiguration = (field: string, data: string, configuration: ConfigurationDto): ValidationResult => {
    let isValid = true;
    let message = "";

    if (configuration.minLength && data.length < configuration.minLength) {
      message = `${field} must be longer than ${configuration.minLength} characters.`;
      isValid = false;
    }

    if (configuration.maxLength && data.length > configuration.maxLength) {
      message = `${field} must be shorter than ${configuration.maxLength} characters.`;
      isValid = false;
    }

    if (configuration.requireLowercase && !/[a-z]/.test(data)) {
      message = `${field} must contain at least one lowercase letter.`;
      isValid = false;
    }

    if (configuration.requireUppercase && !/[A-Z]/.test(data)) {
      message = `${field} must contain at least one uppercase letter.`;
      isValid = false;
    }

    if (configuration.requireDigit && !/\d/.test(data)) {
      message = `${field} must contain at least one digit.`;
      isValid = false;
    }

    if (configuration.requireSpecialChar && !/[^a-zA-Z0-9]/.test(data)) {
      message = `${field} must contain at least one special character.`;
      isValid = false;
    }

    return { isValid, message };
  };

  // handle on change
  // change password strength indicator
  const changePassInd = (event: ChangeEvent<HTMLInputElement>) => {
    let strength: number = 0;

    const value = event.target.value;

    if (value.length >= 8) {
      strength += 1;
    }
    if (/[A-Z]/.test(value)) {
      strength += 1;
    }
    if (/\d/.test(value)) {
      strength += 1;
    }
    if (/[^a-zA-Z0-9]/.test(value)) {
      strength += 1;
    }

    const color = strengthColor[`c${strength}` as keyof typeof strengthColor];

    if (indRef.current) {
      indRef.current.style.backgroundColor = color;
    }
  };
  //*/

  // handle on click
  // focus on input
  const focusOnClick = (inputRef: RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };
  //*/

  if (processing) return <LoadingPage text="Creating account..." />;

  return (
    <form className={classes["registration-form"]} onSubmit={(event) => signUpUser(event)}>
      <IconCreator icons={registerPageIcons} iconName="bgPawn" color={mainColor.c0} iconClass={classes["bg-svg"]} />

      <h2 className={classes["form-title"]}>Create Account</h2>

      <div className={classes["change-form"]}>
        Already have an account? <span onClick={() => setModal(RegistrationInterface.signIn)}>Sing In</span>
      </div>

      {/* inputs */}
      <div className={classes.inputs}>
        <div
          className={classes["form-row"]}
          onClick={() => {
            focusOnClick(emailInputRef);
          }}
        >
          <input
            ref={emailInputRef}
            name="email"
            type="text"
            placeholder="E-mail"
            autoComplete="e-mail"
            className={classes["form-input"]}
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>

        <div
          className={classes["form-row"]}
          onClick={() => {
            focusOnClick(usernameInputRef);
          }}
        >
          <input
            ref={usernameInputRef}
            name="userName"
            type="text"
            placeholder="UserName"
            autoComplete="username"
            className={classes["form-input"]}
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>

        <div
          className={classes["form-row"]}
          onClick={() => {
            focusOnClick(passwordInputRef);
          }}
        >
          <input
            ref={passwordInputRef}
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
            className={classes["form-input"]}
            onChange={(event) => {
              changePassInd(event);
            }}
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
          <span ref={indRef} className={classes["reg-pass-ind"]} />
        </div>

        <div
          className={classes["form-row"]}
          onClick={() => {
            focusOnClick(confPassInputRef);
          }}
        >
          <input
            ref={confPassInputRef}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autoComplete="off"
            className={classes["form-input"]}
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>
      </div>
      {/* --- */}

      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      <button type="submit" className={classes["registration-button"]}>
        <span>Sign Up</span>
      </button>
    </form>
  );
}

export default SignUpModal;
