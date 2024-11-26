import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { greyColor, mainColor, strengthColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { errorDisplay } from "../../../shared/utils/functions/errors";
import { GetRegisterConfDto, IsEmailVerifiedDto, LogInUserDto } from "../../../shared/utils/types/userDtos";
import { RegistrationInterface } from "../../../shared/utils/objects/interfacesEnums";
import {
  LogInUserModel,
  RegenerateCodeModel,
  ResetPasswordModel,
  SendResetPasswordCodeModel,
} from "../../../shared/utils/types/userModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "../RegisterPageIcons";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { checkFromConfiguration, ValidationResult } from "./RegisterFunctions";

type PasswordIconOption = {
  name: "eyeOpen" | "eyeClosed";
  class: typeof classes.open | typeof classes.close;
};

type ResetPasswordModalProps = {
  // path that user wanted
  userPath: string;
  // for checking new password
  userPassConf: GetRegisterConfDto | null;
  // to change displayed modal
  setModal: Dispatch<SetStateAction<RegistrationInterface>>;
};

function ResetPasswordModal({ userPath, userPassConf, setModal }: ResetPasswordModalProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confPassInputRef = useRef<HTMLInputElement>(null);
  // password strength indicator ref
  const indRef = useRef<HTMLSpanElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");
  // code input value
  const [codeValue, setCodeValue] = useState<string>("");
  // email input value
  const [emailValue, setEmailValue] = useState<string>("");

  // for displaying other fields
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [codeWasSend, setCodeWasSend] = useState<boolean>(false);

  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);
  const [sendingCodeProcessing, setSendingCodeProcessing] = useState<boolean>(false);

  // for password icon selection
  const [passwordIconOption, setPasswordIconOption] = useState<PasswordIconOption>({
    name: "eyeOpen",
    class: classes.open,
  });

  // check for email format
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailValue)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }, [emailValue]);

  // resets password
  // set validation token
  // redirect to main
  const resetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (
      !userPassConf ||
      !emailInputRef.current ||
      !codeInputRef.current ||
      !passwordInputRef.current ||
      !confPassInputRef.current
    ) {
      setErrorMess("Something went wrong.");
      return;
    }

    if (emailValue === "") {
      emailInputRef.current.classList.add(classes.err);
      setErrorMess("Please provide email and click send to get verification code.");
      return;
    }

    // reset data
    const form = event.target as HTMLFormElement;
    const resetData: ResetPasswordModel = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      code: (form.elements.namedItem("code") as HTMLInputElement).value.trim(),
      newPassword: (form.elements.namedItem("password") as HTMLInputElement).value,
      confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    };

    // check for white spaces in password
    if (resetData.newPassword.indexOf(" ") >= 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can't contain whitespace.");
      return;
    }

    // check password with configuration
    const checkUserPass: ValidationResult = checkFromConfiguration("Password", resetData.newPassword, userPassConf);

    // verify password
    if (!checkUserPass.isValid) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess(checkUserPass.message);
      return;
    }

    // check password match
    if (resetData.newPassword !== resetData.confirmPassword) {
      confPassInputRef.current.classList.add(classes.err);
      setErrorMess("Passwords don't match.");
      return;
    }

    try {
      setProcessing(true);

      // reset password
      await axios.put(userController.resetPassword(), resetData);

      showPopup("PASSWORD CHANGED", "success");

      // log in user
      const userData: LogInUserModel = {
        emailOrUsername: (form.elements.namedItem("email") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
      };

      const signInResponse = await axios.post<LogInUserDto>(userController.logInUser(), userData);

      // set token
      localStorage.setItem("token", signInResponse.data.token);

      // users email verification check
      const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

      const isVerified = isVerifiedResponse.data.isEmailVerified;
      if (!isVerified) {
        await regenerateCode();

        showPopup("NEW CODE SENT", "success");

        setProcessing(false);

        setModal(RegistrationInterface.verify);
      } else {
        setProcessing(false);
        navigate(userPath);
      }
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);

      setProcessing(false);
    }
  };

  // regenerates verification code
  const sendPasswordRecoveryCode = async (): Promise<void> => {
    try {
      setErrorMess("");

      // check email
      if (!isEmailValid) {
        setErrorMess("Email incorrect.");
      }

      setSendingCodeProcessing(true);

      const model: SendResetPasswordCodeModel = {
        email: emailValue,
      };

      // generate new code and delete previous
      await axios.put(userController.sendResetPasswordCode(), model);

      setCodeWasSend(true);

      setSendingCodeProcessing(false);

      showPopup("CODE SENT", "success");
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);
    }
  };

  // regenerates verification code
  // for logging again without verification
  const regenerateCode = async (): Promise<void> => {
    try {
      const model: RegenerateCodeModel = {};

      // generate new code and delete previous
      await axios.post(userController.regenerateCode(), model, getAuthorization());
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);
    }
  };

  // handle click
  // focus to input
  const focusOnClick = (inputRef: RefObject<HTMLInputElement>): void => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };

  // handle code input on change
  const handleCodeInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setCodeValue(inputValue);
    }
  };

  // handle email input on change
  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    setEmailValue(inputValue);
  };

  // auto pasting code
  const onPasteCode = async (): Promise<void> => {
    try {
      const code = await navigator.clipboard.readText();

      if (/^\d{0,6}$/.test(code)) setCodeValue(code);
    } catch (err) {
      showPopup("ERROR PASTING CODE", "error");
    }
  };

  // password show
  const onShowPassword = (): void => {
    const passwordInput = passwordInputRef.current;

    if (!passwordInput) return;

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setPasswordIconOption({
        name: "eyeClosed",
        class: classes.close,
      });
    } else {
      passwordInput.type = "password";
      setPasswordIconOption({
        name: "eyeOpen",
        class: classes.open,
      });
    }
  };

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

  if (processing) return <LoadingPage text="Logging in..." />;

  return (
    <form
      data-testid="sign-in-form-modal"
      className={classes["registration-form"]}
      onSubmit={(event) => resetPassword(event)}
    >
      <IconCreator icons={registerPageIcons} iconName={"bgPawn"} color={mainColor.c0} iconClass={classes["bg-svg"]} />

      <h2 className={classes["form-title"]}>Reset Password</h2>

      {/* inputs */}
      <div className={classes.inputs}>
        {/* email */}
        <div
          className={`
            ${classes["form-row"]} 
            ${!sendingCodeProcessing ? "" : classes["row-disabled"]}
          `}
          onClick={() => {
            focusOnClick(emailInputRef);
          }}
        >
          <input
            ref={emailInputRef}
            name="email"
            type="text"
            placeholder="Email"
            autoComplete="off"
            value={emailValue}
            className={classes["form-input"]}
            onChange={(event) => {
              handleEmailInputChange(event);
            }}
          />

          <p
            className={classes.send}
            onClick={() => {
              sendPasswordRecoveryCode();
            }}
          >
            <IconCreator
              icons={registerPageIcons}
              iconName={"send"}
              color={greyColor.c6}
              iconClass={classes["input-button-svg"]}
            />
          </p>

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>

        {/* verification code */}
        <div
          className={`
            ${classes["form-row"]}
            ${isEmailValid && codeWasSend ? "" : classes["row-disabled"]}
          `}
          onClick={() => {
            focusOnClick(codeInputRef);
          }}
        >
          <input
            ref={codeInputRef}
            name="code"
            type="number"
            max={999999}
            placeholder="000000"
            autoComplete="off"
            value={codeValue}
            tabIndex={isEmailValid && codeWasSend ? 0 : -1}
            className={classes["form-input"]}
            onChange={(event) => {
              handleCodeInputChange(event);
            }}
          />

          <p
            className={classes.paste}
            onClick={() => {
              onPasteCode();
            }}
          >
            <IconCreator
              icons={registerPageIcons}
              iconName={"paste"}
              color={greyColor.c6}
              iconClass={classes["input-button-svg"]}
            />
          </p>

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>

        {/* password */}
        <div
          className={`
            ${classes["form-row"]}
            ${isEmailValid && codeWasSend ? "" : classes["row-disabled"]}
          `}
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
            tabIndex={isEmailValid && codeWasSend ? 0 : -1}
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

        {/* confirm password */}
        <div
          className={`
            ${classes["form-row"]}
            ${isEmailValid && codeWasSend ? "" : classes["row-disabled"]}
          `}
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
            tabIndex={isEmailValid && codeWasSend ? 0 : -1}
            className={classes["form-input"]}
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>
      </div>

      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      <button type="submit" className={classes["registration-button"]}>
        <span>Reset Password</span>
      </button>

      <p
        className={classes.cancel}
        onClick={() => {
          setModal(RegistrationInterface.signIn);
        }}
      >
        <span>Cancel</span>
      </p>
    </form>
  );
}

export default ResetPasswordModal;
