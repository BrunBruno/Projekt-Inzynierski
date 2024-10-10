import { Dispatch, FormEvent, RefObject, SetStateAction, useRef, useState } from "react";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { errorDisplay } from "../../../shared/utils/functions/errors";
import { IsEmailVerifiedDto, LogInUserDto } from "../../../shared/utils/types/userDtos";
import { RegistrationInterface } from "../../../shared/utils/objects/interfacesEnums";
import { LogInUserModel } from "../../../shared/utils/types/userModels";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { registerPageIcons } from "../RegisterPageIcons";

type SignInModalProps = {
  // path that user wanted
  userPath: string;
  // to change displayed modal
  setModal: Dispatch<SetStateAction<number>>;
};

function SignInModal({ userPath, setModal }: SignInModalProps) {
  ///

  const navigate = useNavigate();

  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");

  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // sign in user
  // set validation token
  // redirect to main
  const signInUser = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!emailInputRef.current || !passwordInputRef.current) {
      setErrorMess("Something went wrong.");
      return;
    }

    // user data
    const form = event.target as HTMLFormElement;
    const userData: LogInUserModel = {
      emailOrUsername: form.email.value.trim(),
      password: form.password.value,
    };

    // check for empty password
    if (userData.password.length === 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can not be empty.");
      return;
    }

    try {
      setProcessing(true);

      // Log in user
      const signInResponse = await axios.post<LogInUserDto>(userController.logInUser(), userData);

      // set token
      localStorage.setItem("token", signInResponse.data.token);

      // users email verification check
      const isVerifiedResponse = await axios.get<IsEmailVerifiedDto>(userController.isVerified(), getAuthorization());

      setProcessing(false);

      // check if user email is verified
      const isVerified = isVerifiedResponse.data.isEmailVerified;
      if (!isVerified) {
        // go to email verification
        setModal(RegistrationInterface.verify);
      } else {
        // navigate to main page
        navigate(userPath);
      }
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);

      setProcessing(false);
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

  if (processing) return <LoadingPage text="Logging in..." />;

  return (
    <form className={classes["registration-form"]} onSubmit={(event) => signInUser(event)}>
      <IconCreator icons={registerPageIcons} iconName={"bgPawn"} color={mainColor.c0} iconClass={classes["bg-svg"]} />

      <h2 className={classes["form-title"]}>Login Now</h2>

      <div className={classes["change-form"]}>
        Don't have an account? <span onClick={() => setModal(RegistrationInterface.signUp)}>Sing Up</span>
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

          <IconCreator icons={registerPageIcons} iconName="arrow" iconClass={classes.arrow} />
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
          />

          <IconCreator icons={registerPageIcons} iconName={"arrow"} iconClass={classes.arrow} />
        </div>
      </div>
      {/* --- */}

      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      <button type="submit" className={classes["registration-button"]}>
        <span>Sign In</span>
      </button>
    </form>
  );
}

export default SignInModal;
