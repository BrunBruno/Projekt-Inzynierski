import { useEffect, useRef, useState } from 'react';
import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import {
  mainColor,
  strengthColor,
} from '../../../shared/utils/enums/colorMaps';
import { registrationActionEnum } from '../../../shared/utils/enums/registrationAction';
import classes from './SignSection.module.scss';
import axios, { AxiosError } from 'axios';
import { baseUrl } from '../../../shared/utils/functions/getAuthorization';
import {
  ConfigurationData,
  dataConfigurations,
} from '../../../shared/utils/enums/dataConfiguration';
import {
  ValidationResult,
  checkFromConfiguration,
} from '../../../shared/utils/functions/checkFromConfiguration';
import SignArrowSvg from './SignArrow';
import LoadingPage from '../../../shared/components/loading-page/LoadingPage';

type SignUpSectionProps = {
  // change displayed modal
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function SignUpSection({ setModal }: SignUpSectionProps) {
  // inputs refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confPassInputRef = useRef<HTMLInputElement>(null);
  // password strength indicator ref
  const indRef = useRef<HTMLSpanElement>(null);

  // error message content
  const [errorMess, setErrorMess] = useState<string>('');
  // user name configuration
  const [userNameConf, setUserNameConf] = useState<ConfigurationData | null>(
    null
  );
  // password configuration
  const [userPassConf, setUserPassConf] = useState<ConfigurationData | null>(
    null
  );

  useEffect(() => {
    // api call
    // gets configuractions
    const getDataConfigurations = async (): Promise<void> => {
      try {
        // get username configuration
        const userNameConfResp = await axios.get<ConfigurationData>(
          `${baseUrl}/user/configuration/${dataConfigurations.userName}`
        );

        setUserNameConf(userNameConfResp.data);

        // get password configuration
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

  // api call
  // creates user account
  const signUpUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (
      userNameConf === null ||
      userPassConf === null ||
      !emailInputRef.current ||
      !usernameInputRef.current ||
      !passwordInputRef.current ||
      !confPassInputRef.current
    ) {
      setErrorMess('Something went wrong.');
      return;
    }

    // user data
    const form = event.target as HTMLFormElement;
    const userData = {
      email: form.email.value.trim(),
      userName: form.userName.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      imageUrl: '',
    };

    // Check for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      emailInputRef.current.classList.add(classes.err);
      setErrorMess('Email is not valid.');
      return;
    }

    // check username with configuration
    const checkUserName: ValidationResult = checkFromConfiguration(
      'UserName',
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
    if (userData.password.indexOf(' ') >= 0) {
      passwordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can't contain whitespaces.");
      return;
    }

    // check password with configuration
    const checkUserPass: ValidationResult = checkFromConfiguration(
      'Password',
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
      // create account
      // await axios.post(`${baseUrl}/user/sign-up`, userData);
      await axios.post(`${baseUrl}/user/sign-up`, userData);

      const logUserData = {
        email: form.email.value.trim(),
        password: form.password.value,
      };

      // set temporarly user data
      localStorage.setItem('logUserTemp', JSON.stringify(logUserData));

      // login user, get unverified token
      const response = await axios.post(`${baseUrl}/user/sign-in`, logUserData);

      // set unverified token
      localStorage.setItem('token', response.data.token);

      // change modal to email verification
      setModal(registrationActionEnum.verify);
    } catch (err) {
      // display backend erros
      if (err instanceof AxiosError) {
        if (err.response && err.response.data) {
          setErrorMess(err.response.data);
        }
      }

      console.log(err);
    }
  };

  // handle on change
  // change passsword strength indicator
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

  // handle on click
  // focus on input
  const focusOnClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };

  if (!userNameConf || !userPassConf) {
    return <LoadingPage />;
  }

  return (
    <form
      className={classes['registration-form']}
      onSubmit={(event) => signUpUser(event)}
    >
      {/* bg */}
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes['bg-svg']} />

      {/* header */}
      <h2>Create Account</h2>
      <div className={classes['change-form']}>
        Already have an account?{' '}
        <span onClick={() => setModal(registrationActionEnum.signIn)}>
          Sing In
        </span>
      </div>

      {/* inputs */}
      <div
        className={classes['form-row']}
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
          className={classes['form-input']}
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>

      <div
        className={classes['form-row']}
        onClick={() => {
          focusOnClick(usernameInputRef);
        }}
      >
        <input
          ref={usernameInputRef}
          name="userName"
          type="text"
          placeholder="UserName"
          autoComplete="off"
          className={classes['form-input']}
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>

      <div
        className={classes['form-row']}
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
          className={classes['form-input']}
          onChange={(event) => {
            changePassInd(event);
          }}
        />
        <SignArrowSvg iconClass={classes.arrow} />
        <span ref={indRef} className={classes['reg-pass-ind']} />
      </div>

      <div
        className={classes['form-row']}
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
          className={classes['form-input']}
        />
        <SignArrowSvg iconClass={classes.arrow} />
      </div>
      {/* end inputs */}

      {/* errors */}
      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      {/* button */}
      <button type="submit" className={classes['registration-button']}>
        <span>Sign Up</span>
      </button>
    </form>
  );
}

export default SignUpSection;
