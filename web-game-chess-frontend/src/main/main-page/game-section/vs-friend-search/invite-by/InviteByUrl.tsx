import { forwardRef, useImperativeHandle, useState } from "react";
import classes from "./InviteBy.module.scss";
import { InviteByUrlRef } from "../VsFreindSearchObjects";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/displayError";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import { CreateGameWithLinkModel } from "../../../../../shared/utils/types/gameModels";
import { CreateGameWithLinkDto } from "../../../../../shared/utils/types/gameDtos";
import { useTimingType } from "../../../../../shared/utils/hooks/useTimingType";
import { TimingTypeModel } from "../../../../../shared/utils/types/abstracDtosAndModels";
import { timingTypes } from "../../../../../shared/utils/enums/entitiesEnums";

type InviteByUrlProps = {
  // to set obatined game url
  setSelectedByUrl: React.Dispatch<React.SetStateAction<boolean>>;
};

const InviteByUrl = forwardRef<InviteByUrlRef, InviteByUrlProps>(
  ({ setSelectedByUrl }: InviteByUrlProps, ref: React.ForwardedRef<InviteByUrlRef>) => {
    ///

    const { showPopup } = usePopup();
    const { setTimingType } = useTimingType();

    const [newGameLink, setNewGameLink] = useState<CreateGameWithLinkDto | null>(null);

    // invite to game by url
    // obtains game link
    const onInviteByUrl = async (header: string, values: number[]): Promise<void> => {
      try {
        const typeValue = timingTypes[header.toLowerCase()];

        const gameType: TimingTypeModel = {
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        setTimingType(gameType);

        const gameByEmailModel: CreateGameWithLinkModel = {
          type: typeValue,
          minutes: values[0],
          increment: values[1],
        };

        const response = await axios.post<CreateGameWithLinkDto>(
          gameControllerPaths.createGameWithLink(),
          gameByEmailModel,
          getAuthorization()
        );

        showPopup("Game created", "success");
        setNewGameLink(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    useImperativeHandle(ref, () => ({
      onInviteByUrl,
    }));
    //*/

    // to display url
    const onSelectByUrl = () => {
      setSelectedByUrl(true);
    };
    //*/

    return (
      <div className={classes.invite}>
        <p className={classes.text}>Invite by link:</p>
        <div className={classes["input-holder"]}>
          {newGameLink ? (
            <div className={classes["game-link"]}>
              <a href={newGameLink.gameUrl} className={classes.link}>
                {newGameLink.gameUrl}
              </a>
              <span>Send this email to your friend and enter it to start the game.</span>
            </div>
          ) : (
            <button
              className={classes["generate-button"]}
              onClick={() => {
                onSelectByUrl();
              }}
            >
              Generate
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default InviteByUrl;
