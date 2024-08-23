import { useNavigate } from "react-router-dom";
import classes from "./InviteBy.module.scss";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { useTimingType } from "../../../../../shared/utils/hooks/useTimingType";
import { CreateGameByEmailModel, NotifyUserModel } from "../../../../../shared/utils/types/gameModels";
import { timingTypes } from "../../../../../shared/utils/enums/entitiesEnums";
import { CreateGameByEmailDto } from "../../../../../shared/utils/types/gameDtos";
import axios from "axios";
import {
  gameControllerPaths,
  getAuthorization,
  userControllerPaths,
} from "../../../../../shared/utils/services/ApiService";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import { forwardRef, useImperativeHandle, useState } from "react";
import { InviteByEmailRef } from "../VsFreindSearchObjects";
import RoundArrowSvg from "../../../../../shared/svgs/RoundArrowSvg";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";
import { GetByEmailModel } from "../../../../../shared/utils/types/userModels";
import { GetByEmailDto } from "../../../../../shared/utils/types/userDtos";
import { TimingTypeModel } from "../../../../../shared/utils/types/abstracDtosAndModels";

type InviteByEmailProps = {
  // to set obtained user from email
  setSelectedUser: React.Dispatch<React.SetStateAction<GetByEmailDto | null>>;
};

const InviteByEmail = forwardRef<InviteByEmailRef, InviteByEmailProps>(
  ({ setSelectedUser }: InviteByEmailProps, ref: React.ForwardedRef<InviteByEmailRef>) => {
    ///

    const navigate = useNavigate();
    const { showPopup } = usePopup();
    const { setTimingType } = useTimingType();

    const [selectedEmail, setSelectedEmail] = useState<string>("");

    // to invite friend to game by providing user emial
    const onInviteByEmail = async (email: string, header: string, values: number[]): Promise<void> => {
      try {
        const typeValue = timingTypes[header.toLowerCase()];

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

    // to get user data by provide emial
    const getByEmail = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(selectedEmail)) {
        setSelectedEmail("");
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
    //*/

    // to set email address
    const setEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const email = target.value.toLocaleLowerCase();
      setSelectedEmail(email);
    };
    //*/

    return (
      <div className={classes.invite}>
        <p className={classes.text}>Invite using email:</p>
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
            <RoundArrowSvg color={mainColor.c9} secColor={mainColor.c0} iconClass={classes["arrow-svg"]} />
          </div>
        </div>
      </div>
    );
  }
);

export default InviteByEmail;
