import { ChangeEvent, FormEvent, Fragment, RefObject, useEffect, useRef, useState } from "react";
import classes from "./AccountSettings.module.scss";
import { GetFullUserDto, GetRegisterConfDto } from "../../../../shared/utils/types/userDtos";
import {
  ChangePasswordModel,
  GetRegisterConfModel,
  UpdateUserDataModel,
} from "../../../../shared/utils/types/userModels";
import { checkFromConfiguration, passwordRequirements, ValidationResult } from "./AccountSettingsData";
import { errorDisplay, getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { DataConfiguration } from "../../../../shared/utils/objects/entitiesEnums";
import axios from "axios";
import { getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";

type AccountSettingsProps = {
  // user data
  user: GetFullUserDto | null;
};

function AccountSettings({ user }: AccountSettingsProps) {
  ///

  const { showPopup } = usePopup();

  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);
  const confPasswordInputRef = useRef<HTMLInputElement>(null);

  const [errorMess, setErrorMess] = useState<string>("");

  const [userPassConf, setUserPassConf] = useState<GetRegisterConfDto | null>(null);

  const [isAccountPrivate, setIsAccountPrivate] = useState<boolean>(false);

  const [passwordIndicators, setPasswordIndicators] = useState<boolean[]>([false, false, false, false, false, false]);

  useEffect(() => {
    if (!user) return;
    setIsAccountPrivate(user.isPrivate);
  }, [user]);

  // to get register configuration
  useEffect(() => {
    const getDataConfiguration = async (): Promise<void> => {
      try {
        const model: GetRegisterConfModel = {
          configurationId: DataConfiguration.userPassword,
        };

        // get password configuration
        const response = await axios.get<GetRegisterConfDto>(userController.getRegisterConf(model));

        setUserPassConf(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getDataConfiguration();
  }, []);

  const changePassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (
      !userPassConf ||
      !oldPasswordInputRef.current ||
      !newPasswordInputRef.current ||
      !confPasswordInputRef.current
    ) {
      setErrorMess("Something went wrong.");
      return;
    }

    // reset data
    const form = event.target as HTMLFormElement;
    const model: ChangePasswordModel = {
      oldPassword: (form.elements.namedItem("oldPassword") as HTMLInputElement).value,
      newPassword: (form.elements.namedItem("newPassword") as HTMLInputElement).value,
      confirmPassword: (form.elements.namedItem("confirmPassword") as HTMLInputElement).value,
    };

    // check for white spaces in password
    if (model.newPassword.indexOf(" ") >= 0) {
      newPasswordInputRef.current.classList.add(classes.err);
      setErrorMess("Password can't contain whitespace.");
      return;
    }

    // check password with configuration
    const checkUserPass: ValidationResult = checkFromConfiguration("Password", model.newPassword, userPassConf);

    // verify password
    if (!checkUserPass.isValid) {
      newPasswordInputRef.current.classList.add(classes.err);
      setErrorMess(checkUserPass.message);
      return;
    }

    // check password match
    if (model.newPassword !== model.confirmPassword) {
      confPasswordInputRef.current.classList.add(classes.err);
      setErrorMess("Passwords don't match.");
      return;
    }

    try {
      await axios.put(userController.changePassword(), model);

      showPopup("PASSWORD CHANGED", "success");
    } catch (err) {
      errorDisplay(err, setErrorMess);
    }
  };

  // handle click, focus to input
  const focusOnClick = (inputRef: RefObject<HTMLInputElement>): void => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.remove(classes.err);
    }
  };

  const changeProfileVisibility = async (isPrivate: boolean): Promise<void> => {
    const model: UpdateUserDataModel = {
      profileIsPrivate: isPrivate,
    };

    try {
      await axios.put(userController.updateUserData(), model, getAuthorization());

      setIsAccountPrivate(isPrivate);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // change password strength indicator
  const changePassInd = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!userPassConf) return;

    const newPassInd = [false, false, false, false, false, false];

    const value = event.target.value;

    if (userPassConf.minLength && value.length >= userPassConf.minLength) newPassInd[0] = true;
    if (userPassConf.maxLength && value.length <= userPassConf.maxLength) newPassInd[1] = true;
    if (/[A-Z]/.test(value)) newPassInd[2] = true;
    if (/[a-z]/.test(value)) newPassInd[3] = true;
    if (/\d/.test(value)) newPassInd[4] = true;
    if (/[^a-zA-Z0-9]/.test(value)) newPassInd[5] = true;

    setPasswordIndicators(newPassInd);
  };

  if (!user || !userPassConf) return <LoadingPage />;

  return (
    <div className={classes.settings}>
      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Change password</p>

        <form
          className={classes["settings-form"]}
          onSubmit={(event) => {
            changePassword(event);
          }}
        >
          <div
            className={classes["form-row"]}
            onClick={() => {
              focusOnClick(oldPasswordInputRef);
            }}
          >
            <input
              ref={oldPasswordInputRef}
              name="oldPassword"
              type="password"
              placeholder="Old password"
              autoComplete="off"
              className={classes["form-input"]}
            />
          </div>

          <div
            className={classes["form-row"]}
            onClick={() => {
              focusOnClick(newPasswordInputRef);
            }}
          >
            <input
              ref={newPasswordInputRef}
              name="newPassword"
              type="password"
              placeholder="New password"
              autoComplete="off"
              className={classes["form-input"]}
              onChange={(event) => {
                changePassInd(event);
              }}
            />
          </div>

          <div
            className={classes["form-row"]}
            onClick={() => {
              focusOnClick(confPasswordInputRef);
            }}
          >
            <input
              ref={confPasswordInputRef}
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              className={classes["form-input"]}
            />
          </div>

          <div className={classes.error}>
            <span>{errorMess}</span>
          </div>

          <button type="submit" className={classes["form-button"]}>
            <span>Change Password</span>
          </button>

          <div className={classes["password-indicator"]}>
            <p>Password strength</p>
            {Object.keys(userPassConf).map((key: string, index: number) => {
              if (userPassConf[key as keyof typeof userPassConf] === null) return <Fragment key={key}></Fragment>;

              return (
                <div key={key} className={classes["conf-ind"]}>
                  <span>{passwordRequirements[index]}:</span>
                  <span>
                    {passwordIndicators[index] ? (
                      <IconCreator icons={gameResultIcons} iconName={"win"} iconClass={classes["ind-icon"]} />
                    ) : (
                      <IconCreator icons={gameResultIcons} iconName={"lose"} iconClass={classes["ind-icon"]} />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </form>
      </div>

      <div className={classes.settings__row}>
        <p className={classes["row-title"]}>Profile visibility</p>

        <form className={classes["settings-form"]}>
          <div className={classes["form-row"]}>
            <label className={classes["visibility-label"]}>
              <input
                name="visibility"
                type="radio"
                className={classes["radio-input"]}
                checked={!isAccountPrivate}
                onChange={() => {
                  changeProfileVisibility(false);
                }}
              />
              <span className={classes["check-mark"]}></span>
              <span>Visible</span>
            </label>

            <p className={classes["text"]}>
              Choosing this option will make your profile visible to other users. Your information and activity can be
              seen within the platform, enhancing interactions and connections.
            </p>
          </div>

          <div className={classes["form-row"]}>
            <label className={classes["visibility-label"]}>
              <input
                name="visibility"
                type="radio"
                className={classes["radio-input"]}
                checked={isAccountPrivate}
                onChange={() => {
                  changeProfileVisibility(true);
                }}
              />
              <span className={classes["check-mark"]}></span>
              <span>Hidden</span>
            </label>

            <p className={classes["text"]}>
              Selecting this option will keep your profile hidden. Other users will not be able to view your information
              or activities, ensuring your privacy is maintained.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountSettings;
