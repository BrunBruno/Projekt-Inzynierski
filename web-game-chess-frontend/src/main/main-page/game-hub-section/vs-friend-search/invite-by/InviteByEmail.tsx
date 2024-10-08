import { useNavigate } from "react-router-dom";
import classes from "./InviteBy.module.scss";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { useTimingType } from "../../../../../shared/utils/hooks/useTimingType";
import { CreateGameByEmailModel, NotifyUserModel } from "../../../../../shared/utils/types/gameModels";
import { CreateGameByEmailDto } from "../../../../../shared/utils/types/gameDtos";
import axios from "axios";
import {
  gameControllerPaths,
  getAuthorization,
  userControllerPaths,
} from "../../../../../shared/utils/services/ApiService";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
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
import { InviteByEmailRef } from "../VsFriendSearchData";
import { mainColor } from "../../../../../shared/utils/objects/colorMaps";
import { GetByEmailModel } from "../../../../../shared/utils/types/userModels";
import { GetByEmailDto } from "../../../../../shared/utils/types/userDtos";
import { TimingTypeModel } from "../../../../../shared/utils/types/abstractDtosAndModels";
import { getEnumValueByKey } from "../../../../../shared/utils/functions/enums";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../../shared/svgs/iconsMap/SymbolIcons";
import { TimingType } from "../../../../../shared/utils/objects/entitiesEnums";
import { TimingTypeName } from "../../../../../shared/utils/objects/constantLists";

type InviteByEmailProps = {
  // to set obtained user from email
  setSelectedUser: Dispatch<SetStateAction<GetByEmailDto | null>>;
};

const InviteByEmail = forwardRef<InviteByEmailRef, InviteByEmailProps>(
  ({ setSelectedUser }: InviteByEmailProps, ref: ForwardedRef<InviteByEmailRef>) => {
    ///

    const navigate = useNavigate();
    const { showPopup } = usePopup();
    const { setTimingType } = useTimingType();

    // email input text
    const [selectedEmail, setSelectedEmail] = useState<string>("");

    // to invite friend to game by providing user email
    const onInviteByEmail = async (email: string, header: TimingTypeName, values: [number, number]): Promise<void> => {
      try {
        const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

        const gameType: TimingTypeModel = {
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        setTimingType(gameType);

        const gameByEmailModel: CreateGameByEmailModel = {
          email: email,
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        const privateGameResponse = await axios.post<CreateGameByEmailDto>(
          gameControllerPaths.createGameByEmail(),
          gameByEmailModel,
          getAuthorization()
        );

        const notifyModel: NotifyUserModel = {
          friendId: privateGameResponse.data.friendId,
          gameId: privateGameResponse.data.gameId,
          inviter: privateGameResponse.data.inviter,
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        await GameHubService.NotifyUser(notifyModel);

        showPopup("User invited", "success");
        navigate(`await/${privateGameResponse.data.gameId}`);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    useImperativeHandle(ref, () => ({
      onInviteByEmail,
    }));
    //*/

    // to get user data by provide email
    const getByEmail = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(selectedEmail)) {
        setSelectedEmail("");
        showPopup("Incorrect email.", "warning");
        return;
      }

      const getByEmailModel: GetByEmailModel = {
        email: selectedEmail,
      };

      try {
        const userResponse = await axios.get<GetByEmailDto>(
          userControllerPaths.getByEmail(getByEmailModel),
          getAuthorization()
        );

        setSelectedUser(userResponse.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    const submitEmail = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      getByEmail();
    };
    //*/

    // to set email address
    const setEmail = (event: ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const email = target.value.toLocaleLowerCase();
      setSelectedEmail(email);
    };
    //*/

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
