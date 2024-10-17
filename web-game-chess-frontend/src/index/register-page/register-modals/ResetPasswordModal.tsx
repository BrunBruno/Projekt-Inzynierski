import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useRef, useState } from "react";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { errorDisplay } from "../../../shared/utils/functions/errors";
import { GetRegisterConfDto, IsEmailVerifiedDto, LogInUserDto } from "../../../shared/utils/types/userDtos";
import { RegistrationInterface } from "../../../shared/utils/objects/interfacesEnums";
import { LogInUserModel, ResetPasswordModel, SendResetPasswordCodeModel } from "../../../shared/utils/types/userModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "../RegisterPageIcons";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { checkFromConfiguration, ValidationResult } from "./RegisterFunctions";

type ResetPasswordModalProps = {
  // path that user wanted
  userPath: string;
  // to change displayed modal
  setModal: Dispatch<SetStateAction<number>>;
  //
  userPassConf: GetRegisterConfDto | null;
};

function ResetPasswordModal({ userPath, setModal, userPassConf }: ResetPasswordModalProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confPassInputRef = useRef<HTMLInputElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");
  // code input value
  const [codeValue, setCodeValue] = useState<string>("");
  // email input value
  const [emailValue, setEmailValue] = useState<string>("");

  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // resets password
  // set validation token
  // redirect to main
  const resetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!userPassConf || !codeInputRef.current || !passwordInputRef.current || !confPassInputRef.current) {
      setErrorMess("Something went wrong.");
      return;
    }

    // reset data
    const form = event.target as HTMLFormElement;
    const resetData: ResetPasswordModel = {
      code: (form.elements.namedItem("code") as HTMLInputElement).value.trim(),
      newPassword: (form.elements.namedItem("password") as HTMLInputElement).value,
      passwordConfirm: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
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
    if (resetData.newPassword !== resetData.passwordConfirm) {
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

      localStorage.setItem("token", signInResponse.data.token);

      // users email verification check
      const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

      setProcessing(false);

      const isVerified = isVerifiedResponse.data.isEmailVerified;
      if (!isVerified) {
        setModal(RegistrationInterface.verify);
      } else {
        navigate(userPath);
      }
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);

      setProcessing(false);
    }
  };
  //*/

  // regenerates verification code
  const sendPasswordRecoveryCode = async (): Promise<void> => {
    try {
      const model: SendResetPasswordCodeModel = {
        email: emailValue,
      };

      // generate new code and delete previous
      await axios.post(userController.sendResetPasswordCode(), model, getAuthorization());
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);
    }
  };
  //*/

  // handle click
  // focus to input
  const focusOnClick = (inputRef: RefObject<HTMLInputElement>): void => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };
  //*/

  // handle code input on change
  const handleCodeInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setCodeValue(inputValue);
    }
  };
  //*/

  // handle email input on change
  const handleEmailInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    setEmailValue(inputValue);
  };
  //*/

  // auto pasting
  const onPasteCode = async (): Promise<void> => {
    try {
      const code = await navigator.clipboard.readText();

      if (/^\d{0,6}$/.test(code)) {
        setCodeValue(code);
      }
    } catch (err) {
      showPopup("ERROR PASTING CODE", "error");
    }
  };
  //*/

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
          className={classes["form-row"]}
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
            value={codeValue}
            className={classes["action-input"]}
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
              color={mainColor.c5}
              iconClass={classes["paste-svg"]}
            />
          </p>
        </div>

        {/* verification code */}
        <div
          className={classes["form-row"]}
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
            className={classes["action-input"]}
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
              color={mainColor.c5}
              iconClass={classes["paste-svg"]}
            />
          </p>
        </div>

        {/* password */}
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
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>

        {/* confirm password */}
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
        <span>Reset Password</span>
      </button>

      <p
        className={classes.cancel}
        onClick={() => {
          setModal(RegistrationInterface.signUp);
        }}
      >
        <span>Cancel</span>
      </p>
    </form>
  );
}

export default ResetPasswordModal;
