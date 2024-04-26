import { useRef, useState } from "react";
import DetailPawnIconSvg from "../../../shared/svgs/DetailPawnIconSvg";
import { mainColor } from "../../../shared/utils/enums/colorMaps";
import classes from "./SignSection.module.scss";

function VerifySection() {
  const errorRef = useRef<HTMLDivElement>(null);
  const [errorMess, setErrorMess] = useState<string>("");
  const [codeValue, setcodeValue] = useState<string>("");

  const verifyUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const regenerateCode = async () => {};

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d{0,6}$/.test(inputValue)) {
      setcodeValue(inputValue);
    }
  };

  return (
    <form
      className={classes["sign-form"]}
      onSubmit={(event) => verifyUser(event)}
    >
      <DetailPawnIconSvg color={mainColor.c0} iconClass={classes["bg-svg"]} />
      <h2>Verify Email Adress</h2>
      <p className={classes["verify-text"]}>
        We sent you verification code to your email. Please enter the code to
        verify your accout.
      </p>
      <div className={classes.verify}>
        <span>Enter code</span>
        <input
          placeholder="000000"
          type="number"
          name="code"
          max={999999}
          autoComplete="off"
          value={codeValue}
          className={classes["verify-input"]}
          onChange={(event) => {
            handleInputChange(event);
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

      <div ref={errorRef} className={classes.error}>
        <span>{errorMess}</span>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default VerifySection;
