import { useEffect, useRef, useState } from "react";
import DetailPawnIconSvg from "../../../shared/svgs/DetailPawnIconSvg";
import {
  mainColor,
  strengthColor,
} from "../../../shared/utils/enums/colorMaps";
import { registrationActionEnum } from "../../../shared/utils/enums/registrationAction";
import classes from "./SignSection.module.scss";
import axios, { AxiosError } from "axios";
import { baseUrl } from "../../../shared/utils/functions/getAuthorization";
import {
  ConfigurationData,
  dataConfigurations,
} from "../../../shared/utils/enums/dataConfiguration";
import {
  ValidationResult,
  checkFromConfiguration,
} from "../../../shared/utils/functions/checkFromConfiguration";
import SignArrowSvg from "./SignArrow";

type SignUpSectionProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignUpSection({ setModal }: SignUpSectionProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confPassInputRef = useRef<HTMLInputElement>(null);

  const indRef = useRef<HTMLSpanElement>(null);

  const errorRef = useRef<HTMLDivElement>(null);
  const [errorMess, setErrorMess] = useState<string>("");

  const [userNameConf, setUserNameConf] = useState<ConfigurationData | null>(
    null
  );
  const [userPassConf, setUserPassConf] = useState<ConfigurationData | null>(
    null
  );

  useEffect(() => {
    const getDataConfigurations = async (): Promise<void> => {
      try {
        const userNameConfResp = await axios.get<ConfigurationData>(
          `${baseUrl}/user/configuration/${dataConfigurations.userName}`
        );

        setUserNameConf(userNameConfResp.data);

        const userPassConfResp = await axios.get<ConfigurationData>(
          `${baseUrl}/user/configuration/${dataConfigurations.userPassword}`
        );

        setUserPassConf(userPassConfResp.data);
      } catch (err) {
        console.log(err);
      }
    };

    getDataConfigurations();
  }, []);

  const signUpUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const userData = {
      email: form.email.value.trim(),
      userName: form.userName.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
    };

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

    // Check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      emailInputRef.current.classList.add(classes.err);
      setErrorMess("Email is not valid.");
      return;
    } else {
    }

    const checkUserName: ValidationResult = checkFromConfiguration(
      "UserName",
      userData.userName,
      userNameConf
    );

    // verify username
    if (!checkUserName.isValid) {
      usernameInputRef.current.classList.add(classes.err);
      setErrorMess(checkUserName.message);
      return;
    }

    // check for white spaces in password
    if (userData.password.indexOf(" ") >= 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can't contain whitespaces.");
      return;
    }

    const checkUserPass: ValidationResult = checkFromConfiguration(
      "Password",
      userData.password,
      userPassConf
    );

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
      await axios.post(`${baseUrl}/user/sign-up`, userData);

      const logUserData = {
        email: form.email.value.trim(),
        password: form.password.value,
      };

      localStorage.setItem("logUserTemp", JSON.stringify(logUserData));

      const response = await axios.post(`${baseUrl}/user/sign-in`, logUserData);

      localStorage.setItem("token", response.data.token);
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.data) {
          setErrorMess(err.response.data);
        }
      }

      console.log(err);
    }
  };

  const changePassInd = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const color = strengthColor[`c${strength}`];

    if (indRef.current) {
      indRef.current.style.backgroundColor = color;
    }
  };

  const focusOnClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };

  return (
    <form
      className={classes["sign-form"]}
      onSubmit={(event) => signUpUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes["bg-svg"]} />
      <h2>Create Account</h2>
      <div className={classes["change-form"]}>
        Already have an account?{" "}
        <span onClick={() => setModal(registrationActionEnum.signIn)}>
          Sing In
        </span>
      </div>
      <div
        className={classes["form-row"]}
        onClick={() => {
          focusOnClick(emailInputRef);
        }}
      >
        <input
          ref={emailInputRef}
          type="text"
          placeholder="E-mail"
          name="email"
          autoComplete="off"
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>
      <div
        className={classes["form-row"]}
        onClick={() => {
          focusOnClick(usernameInputRef);
        }}
      >
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="UserName"
          name="userName"
          autoComplete="off"
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>
      <div
        className={classes["form-row"]}
        onClick={() => {
          focusOnClick(passwordInputRef);
        }}
      >
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Passworrd"
          name="password"
          autoComplete="off"
          onChange={(event) => {
            changePassInd(event);
          }}
        />
        <SignArrowSvg iconClass={classes.arrow} />
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
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          autoComplete="off"
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>
      <div ref={errorRef} className={classes.error}>
        <span>{errorMess}</span>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUpSection;
