import { useRef, useState } from "react";
import DetailPawnIconSvg from "../../../shared/svgs/DetailPawnIconSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import { registrationActionEnum } from "../../../shared/utils/enums/registrationAction";
import classes from "./SignSection.module.scss";
import axios, { AxiosError } from "axios";
import {
  baseUrl,
  getAuthorization,
} from "../../../shared/utils/functions/getAuthorization";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { errorDisplay } from "../../../shared/utils/functions/errorDisplay";

type SignInSectionProps = {
  // change displayed modal
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignInSection({ setModal }: SignInSectionProps) {
  const navigate = useNavigate();

  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");

  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // api call
  // sign in user
  // set validation token
  // redirect to main
  const signInUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!emailInputRef.current || !passwordInputRef.current) {
      setErrorMess("Something went wrong.");
      return;
    }

    // user data
    const form = event.target as HTMLFormElement;
    const userData = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    // Check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      emailInputRef.current.classList.add(classes.err);
      setErrorMess("Email is not valid.");
      return;
    }

    // check for empty password
    if (userData.password.length === 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can not be empty.");
      return;
    }

    try {
      setProcessing(true);

      // Log in user
      const signInResponse = await axios.post(
        `${baseUrl}/user/sign-in`,
        userData
      );

      // set token
      localStorage.setItem("token", signInResponse.data.token);

      // users email verification check
      const isVerifiedResponse = await axios.get(
        `${baseUrl}/user/is-verified`,
        getAuthorization()
      );

      setProcessing(false);

      // check if user email is verified
      const isVerified = isVerifiedResponse.data.isEmailVerified;
      if (!isVerified) {
        // go to email verification
        setModal(registrationActionEnum.verify);
      } else {
        // navigate to main page
        navigate("/main");
      }
    } catch (err) {
      // display backend erros
      errorDisplay(err, setErrorMess);

      setProcessing(false);
      console.log(err);
    }
  };

  // handle click
  // focus to input
  const focusOnClick = (inputRef: React.RefObject<HTMLInputElement>): void => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };

  if (processing) {
    return <LoadingPage />;
  }

  return (
    <form
      className={classes["registration-form"]}
      onSubmit={(event) => signInUser(event)}
    >
      {/* bg */}
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes["bg-svg"]} />

      {/* header */}
      <h2>Login Now</h2>
      <div className={classes["change-form"]}>
        Don't have an accout?{" "}
        <span onClick={() => setModal(registrationActionEnum.signUp)}>
          Sing Up
        </span>
      </div>

      {/* inpus */}
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
          autoComplete="off"
          className={classes["form-input"]}
        />
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
          placeholder="Passworrd"
          autoComplete="off"
          className={classes["form-input"]}
        />
      </div>
      {/* end inputs */}

      {/* errors */}
      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      {/* button */}
      <button type="submit" className={classes["registration-button"]}>
        <span>Sign In</span>
      </button>
    </form>
  );
}

export default SignInSection;
