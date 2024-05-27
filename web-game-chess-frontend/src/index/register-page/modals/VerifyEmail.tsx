import { useState } from "react";
import DetailPawnIconSvg from "../../../shared/svgs/DetailPawnIconSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import classes from "./Sign.module.scss";
import axios from "axios";
import {
  getAuthorization,
  userControllerPaths,
} from "../../../shared/utils/functions/apiFunctions";
import { useNavigate } from "react-router-dom";
import { errorDisplay } from "../../../shared/utils/functions/displayError";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { LogInUserDto } from "../../../shared/utils/types/userDtos";
import {
  LogInUserModel,
  RegenerateCodeModel,
  VerifyEmailModel,
} from "../../../shared/utils/types/userModels";
import PasteIconSvg from "../../../shared/svgs/PasteIconSvg";
import { registrationInterface } from "../../../shared/utils/enums/interfacesEnums";

type VerifyEmailProps = {
  setModal: React.Dispatch<React.SetStateAction<number>>;
};

function VerifyEmail({ setModal }: VerifyEmailProps) {
  const navigate = useNavigate();

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");
  // code input value
  const [codeValue, setCodeValue] = useState<string>("");
  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // verify user email
  // login user after sucessful veryfication
  const verifyUser = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // check if user signed in
    if (!localStorage.getItem("logUserTemp")) {
      setErrorMess("Please sign in first.");
      return;
    }

    // code data
    const form = event.target as HTMLFormElement;
    const verificationCode: VerifyEmailModel = {
      code: form.code.value,
    };

    // check if user inserted code
    if (verificationCode.code.length === 0) {
      setErrorMess("Please enter the code.");
      return;
    }

    try {
      setProcessing(true);

      // verify user email
      await axios.put(
        userControllerPaths.verifyEmail(),
        verificationCode,
        getAuthorization()
      );

      const tempUser: LogInUserModel = JSON.parse(
        localStorage.getItem("logUserTemp")!
      );

      //sign in user after sucessful veryfication
      const logInResponse = await axios.post<LogInUserDto>(
        userControllerPaths.logIn(),
        tempUser
      );

      // remove user temp
      localStorage.removeItem("logUserTemp");

      // set token to local storage
      localStorage.setItem("token", logInResponse.data.token);

      setProcessing(false);

      // navigae to main page
      navigate("/main");
    } catch (err) {
      // display backend erros
      errorDisplay(err, setErrorMess);

      setProcessing(false);

      console.log(err);
    }
  };

  // regenerates verification code
  const regenerateCode = async (): Promise<void> => {
    try {
      const regenerateCode: RegenerateCodeModel = {};

      // generate new code and delete previous
      await axios.post(
        userControllerPaths.regenerateCode(),
        regenerateCode,
        getAuthorization()
      );
    } catch (err) {
      // display backend erros
      errorDisplay(err, setErrorMess);

      console.log(err);
    }
  };

  // handle code input on change
  const handleCodeInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setCodeValue(inputValue);
    }
  };

  const onPasteCode = async () => {
    try {
      const code = await navigator.clipboard.readText();

      if (/^\d{0,6}$/.test(code)) {
        setCodeValue(code);
      }
    } catch (err) {}
  };

  if (processing) {
    return <LoadingPage />;
  }

  return (
    <form
      className={classes["registration-form"]}
      onSubmit={(event) => verifyUser(event)}
    >
      {/* bg */}
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes["bg-svg"]} />

      {/* header */}
      <h2>Verify Email</h2>
      <p className={classes["verify-text"]}>
        We sent you verification code to your email. Please enter the code to
        verify your accout.
      </p>

      {/* input */}
      <div className={classes.verify}>
        <span>Enter code</span>
        <div className={classes["verify-con"]}>
          <input
            name="code"
            type="number"
            max={999999}
            placeholder="000000"
            autoComplete="off"
            value={codeValue}
            className={classes["verify-input"]}
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
            <PasteIconSvg
              color={mainColor.c5}
              iconClass={classes["paste-svg"]}
            />
          </p>
        </div>
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
      <button type="submit" className={classes["registration-button"]}>
        <span>Verify</span>
      </button>

      <p
        className={classes.cancel}
        onClick={() => {
          setModal(registrationInterface.signUp);
        }}
      >
        Cancel
      </p>
    </form>
  );
}

export default VerifyEmail;
