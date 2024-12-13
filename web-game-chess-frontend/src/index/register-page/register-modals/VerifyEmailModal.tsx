import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import classes from "./RegisterModal.module.scss";
import axios from "axios";
import { AuthorizationOptions, getAuthorization, userController } from "../../../shared/utils/services/ApiService";
import { useNavigate } from "react-router-dom";
import { errorDisplay } from "../../../shared/utils/functions/errors";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { LogInUserDto } from "../../../shared/utils/types/userDtos";
import { LogInUserModel, RegenerateCodeModel, VerifyEmailModel } from "../../../shared/utils/types/userModels";
import { RegistrationInterface, StateOptions } from "../../../shared/utils/objects/interfacesEnums";
import { registerPageIcons } from "../RegisterPageIcons";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";

type VerifyEmailModalProps = {
  // path that user wanted
  userPath: string;
  // to set current modal
  setModal: Dispatch<SetStateAction<RegistrationInterface>>;
};

function VerifyEmailModal({ userPath, setModal }: VerifyEmailModalProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // error message content
  const [errorMess, setErrorMess] = useState<string>("");
  // code input value
  const [codeValue, setCodeValue] = useState<string>("");
  // state if something is processing
  const [processing, setProcessing] = useState<boolean>(false);

  // verify user email
  // login user after successful verification
  const verifyUser = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const userDataTemp = localStorage.getItem("userDataTemp");

    // check if user signed in
    if (!userDataTemp) {
      setErrorMess("Please sign in first.");
      return;
    }

    // code data
    const form = event.target as HTMLFormElement;
    const model: VerifyEmailModel = {
      code: (form.elements.namedItem("code") as HTMLInputElement).value.trim(),
    };

    // check if user inserted code
    if (model.code.length === 0) {
      setErrorMess("Please enter the code.");
      return;
    }

    try {
      setProcessing(true);

      const options: AuthorizationOptions = {
        otherToken: localStorage.getItem("tokenTemp"),
      };

      // verify user email
      await axios.put(userController.verifyEmail(), model, getAuthorization(options));

      const tempUser: LogInUserModel = JSON.parse(userDataTemp);

      //sign in user after successful verification
      const logInResponse = await axios.post<LogInUserDto>(userController.logInUser(), tempUser);

      // remove user temp
      localStorage.removeItem("userDataTemp");

      // set token to local storage
      localStorage.setItem("token", logInResponse.data.token);

      setProcessing(false);

      // navigate to main page
      const state: StateOptions = {
        popup: { text: "VERIFICATION SUCCESSFUL", type: "success" },
      };

      navigate(userPath, { state: state });
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);

      setProcessing(false);
    }
  };

  // regenerates verification code
  const regenerateCode = async (): Promise<void> => {
    try {
      const model: RegenerateCodeModel = {};

      const options: AuthorizationOptions = {
        otherToken: localStorage.getItem("tokenTemp"),
      };

      // generate new code and delete previous
      await axios.post(userController.regenerateCode(), model, getAuthorization(options));
    } catch (err) {
      // display backend errors
      errorDisplay(err, setErrorMess);
    }
  };

  // handle code input on change
  const handleCodeInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setCodeValue(inputValue);
    }
  };

  // auto pasting code
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

  if (processing) return <LoadingPage />;

  return (
    <form
      data-testid="verify-email-form-modal"
      className={classes["registration-form"]}
      onSubmit={(event) => verifyUser(event)}
    >
      {/* bg */}
      <IconCreator icons={registerPageIcons} iconName={"bgPawn"} color={mainColor.c0} iconClass={classes["bg-svg"]} />

      {/* header */}
      <h2 className={classes["form-title"]}>Verify Email</h2>

      <p className={classes["verify-text"]}>
        We sent you verification code to your email. Please enter the code to verify your account.
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
            <IconCreator
              icons={registerPageIcons}
              iconName={"paste"}
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
          <span>Resend</span>
        </p>
      </div>

      {/* error */}
      <div className={classes.error}>
        <span>{errorMess}</span>
      </div>

      {/* buttons */}
      <button type="submit" className={classes["registration-button"]}>
        <span>Verify</span>
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

export default VerifyEmailModal;
