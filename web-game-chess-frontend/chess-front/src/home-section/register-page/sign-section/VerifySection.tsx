import { useState } from 'react';
import DetailPawnIconSvg from '../../../shared/svgs/DetailPawnIconSvg';
import { mainColor } from '../../../shared/utils/enums/colorMaps';
import classes from './SignSection.module.scss';
import axios, { AxiosError } from 'axios';
import {
  baseUrl,
  getAuthorization,
} from '../../../shared/utils/functions/getAuthorization';
import { useNavigate } from 'react-router-dom';

type VerifySectionProps = {};

function VerifySection({}: VerifySectionProps) {
  const navigate = useNavigate();

  // error message content
  const [errorMess, setErrorMess] = useState<string>('');
  // code input value
  const [codeValue, setcodeValue] = useState<string>('');

  // api call
  // verify user email
  // login user after sucessful veryfication
  const verifyUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // check if user signed in
    if (!localStorage.getItem('logUserTemp')) {
      setErrorMess('Please sign in first.');
      return;
    }

    // code data
    const form = event.target as HTMLFormElement;
    const verificationCode = {
      code: form.code.value,
    };

    // check if user inserted code
    if (verificationCode.code.length === 0) {
      setErrorMess('Please enter the code.');
      return;
    }

    try {
      // verify user email
      await axios.put(
        `${baseUrl}/user/verify-email`,
        verificationCode,
        getAuthorization()
      );

      //sign in user after sucessful veryfication
      const response = await axios.post(
        `${baseUrl}/user/sign-in`,
        JSON.parse(localStorage.getItem('logUserTemp')!)
      );

      // remove user temp
      localStorage.removeItem('logUserTemp');

      // set token to local storage
      localStorage.setItem('token', response.data.token);

      // navigae to main page
      navigate('main/');
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

  // api call
  // regenerates verification code
  const regenerateCode = async (): Promise<void> => {
    try {
      // generate new code and delete previous
      await axios.post(
        `${baseUrl}/user/regenerate-code`,
        {},
        getAuthorization()
      );
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

  // handle code input on change
  const handleCodeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setcodeValue(inputValue);
    }
  };

  return (
    <form
      className={classes['registration-form']}
      onSubmit={(event) => verifyUser(event)}
    >
      {/* bg */}
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes['bg-svg']} />

      {/* header */}
      <h2>Verify Email Adress</h2>
      <p className={classes['verify-text']}>
        We sent you verification code to your email. Please enter the code to
        verify your accout.
      </p>

      {/* input */}
      <div className={classes.verify}>
        <span>Enter code</span>
        <input
          name="code"
          type="number"
          max={999999}
          placeholder="000000"
          autoComplete="off"
          value={codeValue}
          className={classes['verify-input']}
          onChange={(event) => {
            handleCodeInputChange(event);
          }}
        />
        <p
          className={classes.resend}
          onClick={() => {
            regenerateCode();
          }}
        >
          Resend
        </p>
      </div>
      {/* end innput */}

      {/* error */}
      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      {/* button */}
      <button type="submit" className={classes['registration-button']}>
        <span>Verify</span>
      </button>
    </form>
  );
}

export default VerifySection;
