import { useNavigate } from "react-router-dom";
import classes from "./InviteBy.module.scss";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { CreatePrivateGameByEmailModel, NotifyUserModel } from "../../../../shared/utils/types/webGameModels";
import { CreatePrivateGameByEmailDto } from "../../../../shared/utils/types/webGameDtos";
import axios from "axios";
import { webGameController, getAuthorization, userController } from "../../../../shared/utils/services/ApiService";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useState,
} from "react";
import { InviteByEmailRef } from "../FriendSelectionData";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { GetByEmailModel } from "../../../../shared/utils/types/userModels";
import { GetByEmailDto } from "../../../../shared/utils/types/userDtos";
import { getEnumValueByKey } from "../../../../shared/utils/functions/enums";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { TimingTypeName } from "../../../../shared/utils/objects/constantLists";

type InviteByEmailProps = {
  // to set obtained user from email
  setSelectedUser: Dispatch<SetStateAction<GetByEmailDto | null>>;
};

const InviteByEmail = forwardRef<InviteByEmailRef, InviteByEmailProps>(
  ({ setSelectedUser }: InviteByEmailProps, ref: ForwardedRef<InviteByEmailRef>) => {
    ///

    const navigate = useNavigate();
    const { showPopup } = usePopup();

    // email input text
    const [selectedEmail, setSelectedEmail] = useState<string>("");

    // to invite friend to game by providing user email
    const onInviteByEmail = async (email: string, header: TimingTypeName, values: [number, number]): Promise<void> => {
      const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

      const model: CreatePrivateGameByEmailModel = {
        email: email,
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      try {
        const response = await axios.post<CreatePrivateGameByEmailDto>(
          webGameController.createGameByEmail(),
          model,
          getAuthorization()
        );

        const notifyModel: NotifyUserModel = {
          friendId: response.data.friendId,
          gameId: response.data.gameId,
          inviter: response.data.inviter,
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        await GameHubService.NotifyUser(notifyModel);

        showPopup("USER INVITED", "success");

        navigate(`/main/await/${response.data.gameId}`);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    useImperativeHandle(ref, () => ({
      onInviteByEmail,
    }));

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
        <p className={classes.text}>Invite using email:</p>

        <form
          onSubmit={(event) => {
            submitEmail(event);
          }}
        >
          <div className={classes["input-holder"]}>
            <input
              className={classes["input-mail"]}
              name="email"
              placeholder="email"
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
                color={mainColor.c9}
                iconClass={classes["arrow-svg"]}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default InviteByEmail;
