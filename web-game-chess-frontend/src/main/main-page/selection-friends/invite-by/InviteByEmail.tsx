import classes from "./InviteBy.module.scss";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import axios from "axios";
import { getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { GetByEmailModel } from "../../../../shared/utils/types/userModels";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";

type InviteByEmailProps = {
  // to set obtained user from email
  setSelectedUser: Dispatch<SetStateAction<GetByEmailDto | null>>;
};

function InviteByEmail({ setSelectedUser }: InviteByEmailProps) {
  ///

  const { showPopup } = usePopup();

  // email input text
  const [selectedEmail, setSelectedEmail] = useState<string>("");

  // to get user data by provide email
  const getByEmail = async (): Promise<void> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedEmail)) {
      setSelectedEmail("");
      showPopup("INCORRECT EMAIL", "warning");
      return;
    }

    const model: GetByEmailModel = {
      email: selectedEmail,
    };

    try {
      const userResponse = await axios.get<GetByEmailDto>(userController.getByEmail(model), getAuthorization());

      setSelectedUser(userResponse.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  const submitEmail = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    getByEmail();
  };

  // to set email address
  const setEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const email = target.value.toLocaleLowerCase();
    setSelectedEmail(email);
  };

  return (
    <div className={classes.invite}>
      <p className={classes.header}>
        <span>Invite Using Email</span>
      </p>

      <p className={classes.text}>
        Enter your friend's email below to send them an invitation. Click the arrow to proceed.
      </p>

      <form
        onSubmit={(event) => {
          submitEmail(event);
        }}
      >
        <div className={classes["input-holder"]}>
          <input
            className={classes["input-mail"]}
            name="email"
            placeholder="friend@example.com"
            value={selectedEmail}
            onChange={(event) => {
              setEmail(event);
            }}
          />

          <div
            className={classes["send-icon"]}
            onClick={() => {
              getByEmail();
            }}
          >
            <IconCreator
              icons={symbolIcons}
              iconName={"roundArrow"}
              color={mainColor.c5}
              iconClass={classes["arrow-svg"]}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default InviteByEmail;
