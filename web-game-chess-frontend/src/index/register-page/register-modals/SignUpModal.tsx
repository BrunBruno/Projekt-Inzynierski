import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { greyColor, mainColor, strengthColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { errorDisplay } from "../../../shared/utils/functions/errors";
import { userController } from "../../../shared/utils/services/ApiService";
import { GetRegisterConfDto, LogInUserDto } from "../../../shared/utils/types/userDtos";
import { RegistrationInterface } from "../../../shared/utils/objects/interfacesEnums";
import { LogInUserModel, RegisterUserModel } from "../../../shared/utils/types/userModels";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getCountry } from "../../../shared/utils/functions/externApi";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "../RegisterPageIcons";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { checkFromConfiguration, ValidationResult } from "./RegisterFunctions";

type PasswordIconOption = {
  name: "eyeOpen" | "eyeClosed";
  class: typeof classes.open | typeof classes.close;
};

type SignUpModalProps = {
  // change displayed modal
  setModal: Dispatch<SetStateAction<number>>;
  // restrictions on user username
  userNameConf: GetRegisterConfDto | null;
  // restrictions on user password
  userPassConf: GetRegisterConfDto | null;
};

function SignUpModal({ setModal, userNameConf, userPassConf }: SignUpModalProps) {
  ///

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
  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);
  // state for password peek icon
  const [passwordIconOption, setPasswordIconOption] = useState<PasswordIconOption>({
    name: "eyeOpen",
    class: classes.open,
  });

  useEffect(() => {
    if (userNameConf && userPassConf) setProcessing(false);
  }, [userNameConf, userPassConf]);

  // creates user account
  const signUpUser = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (
      !userNameConf ||
      !userPassConf ||
      !emailInputRef.current ||
      !usernameInputRef.current ||
      !passwordInputRef.current ||
      !confPassInputRef.current
    ) {
      setErrorMess("Something went wrong.");
      return;
    }

    // get current country
    const country = await getCountry();

    // user data
    const form = event.target as HTMLFormElement;

    const userData: RegisterUserModel = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      username: (form.elements.namedItem("userName") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
      country: country === undefined ? "" : country,
    };

    // check for email format
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
        emailOrUsername: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
      };

      // set temporary user data
      localStorage.setItem("userDataTemp", JSON.stringify(logUserData));

      // login user, get unverified token
      const response = await axios.post<LogInUserDto>(userController.logInUser(), logUserData);

      // set unverified token
      localStorage.setItem("tokenTemp", response.data.token);

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

  // handle on password input change
  // change password strength indicator
  const changePassInd = (event: ChangeEvent<HTMLInputElement>): void => {
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

  // handle on input click
  // to focus on input
  const focusOnClick = (inputRef: RefObject<HTMLInputElement>): void => {
    if (!inputRef.current) return;

    inputRef.current.focus();
    inputRef.current.classList.remove(classes.err);
  };
  //*/

  // password peek
  const onShowPassword = (): void => {
    const passwordInput = passwordInputRef.current;
    const confPasswordInput = confPassInputRef.current;

    if (!passwordInput || !confPasswordInput) return;

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      confPasswordInput.type = "text";

      setPasswordIconOption({
        name: "eyeClosed",
        class: classes.close,
      });
    } else {
      passwordInput.type = "password";
      confPasswordInput.type = "password";

      setPasswordIconOption({
        name: "eyeOpen",
        class: classes.open,
      });
    }
  };
  //*/

  if (processing) return <LoadingPage text="Creating account..." />;

  return (
    <form
      data-testid="sign-up-form-modal"
      className={classes["registration-form"]}
      onSubmit={(event) => {
        signUpUser(event);
      }}
    >
      <IconCreator icons={registerPageIcons} iconName="bgPawn" color={mainColor.c0} iconClass={classes["bg-svg"]} />

      <h2 className={classes["form-title"]}>Create Account</h2>

      <div className={classes["change-form"]}>
        Already have an account?{" "}
        <span
          onClick={() => {
            setModal(RegistrationInterface.signIn);
          }}
        >
          Sing In
        </span>
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
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
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
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
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
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Password"
            autoComplete="off"
            className={classes["form-input"]}
            onChange={(event) => {
              changePassInd(event);
            }}
          />

          <p
            className={`
              ${classes.eye} 
              ${passwordIconOption.class}
            `}
            onClick={() => {
              onShowPassword();
            }}
          >
            <IconCreator
              icons={registerPageIcons}
              iconName={passwordIconOption.name}
              color={greyColor.c6}
              iconClass={classes["input-button-svg"]}
            />
          </p>

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
            autoCapitalize="none"
            autoCorrect="off"
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
