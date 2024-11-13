import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import classes from "./AccountSettings.module.scss";
import { GetFullUserDto, GetRegisterConfDto } from "../../../../shared/utils/types/userDtos";
import {
  ChangePasswordModel,
  GetRegisterConfModel,
  UpdateProfileModel,
  UpdateUserDataModel,
} from "../../../../shared/utils/types/userModels";
import { checkFromConfiguration, ValidationResult } from "./AccountSettingsData";
import { errorDisplay, getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { DataConfiguration } from "../../../../shared/utils/objects/entitiesEnums";
import axios from "axios";
import { getAuthorization, userController } from "../../../../shared/utils/services/ApiService";

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
  //*/

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
  //*/

  useEffect(() => {
    if (!user) return;

    setIsAccountPrivate(user.isPrivate);
  }, [user]);

  const changeProfileVisibility = async (): Promise<void> => {
    const model: UpdateUserDataModel = {
      profileIsPrivate: isAccountPrivate,
    };

    try {
      await axios.put(userController.updateUserData(), model, getAuthorization());
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    changeProfileVisibility();
  }, [isAccountPrivate]);

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
                  setIsAccountPrivate(false);
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
                  setIsAccountPrivate(true);
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
