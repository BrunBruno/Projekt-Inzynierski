import {
  Dispatch,
  ForwardedRef,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
  MouseEvent,
} from "react";
import classes from "./InviteBy.module.scss";
import { InviteByUrlRef } from "../VsFriendSearchData";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../../../shared/utils/services/ApiService";
import { CreateGameWithLinkModel } from "../../../../../shared/utils/types/gameModels";
import { CreateGameWithLinkDto } from "../../../../../shared/utils/types/gameDtos";
import { useTimingType } from "../../../../../shared/utils/hooks/useTimingType";
import { TimingTypeModel } from "../../../../../shared/utils/types/abstractDtosAndModels";
import { getEnumValueByKey } from "../../../../../shared/utils/functions/enums";
import { TimingType } from "../../../../../shared/utils/objects/entitiesEnums";

type InviteByUrlProps = {
  // to set obtained url
  setSelectedByUrl: Dispatch<SetStateAction<boolean>>;
};

const InviteByUrl = forwardRef<InviteByUrlRef, InviteByUrlProps>(
  ({ setSelectedByUrl }: InviteByUrlProps, ref: ForwardedRef<InviteByUrlRef>) => {
    ///

    const { showPopup } = usePopup();
    const { setTimingType } = useTimingType();

    const indRef = useRef<HTMLElement>(null);

    const [newGameLink, setNewGameLink] = useState<CreateGameWithLinkDto | null>(null);

    // invite to game by url
    // obtains game link
    const onInviteByUrl = async (header: string, values: [number, number]): Promise<void> => {
      try {
        const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

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

    // to display time selection for generating new game link
    const onSelectByUrl = () => {
      setSelectedByUrl(true);
    };
    //*/

    const showUrlIndicator = (event: MouseEvent<HTMLDivElement>) => {
      const indEle = indRef.current;
      const parentContainer = event.currentTarget;

      if (indEle) {
        if (indEle.classList.contains(classes.show)) {
          indEle.classList.remove(classes.show);
        } else {
          indEle.classList.add(classes.show);

          const rect = parentContainer.getBoundingClientRect();

          indEle.style.left = `${event.clientX - rect.left}px`;
        }
      }
    };

    const copyUrl = () => {
      if (newGameLink !== null) {
        const textToCopy = newGameLink.gameUrl;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showPopup("Link copied.", "info");
          })
          .catch((err) => {
            console.error("Failed to copy text:", err);
          });
      }
    };

    return (
      <div className={classes.invite}>
        <p className={classes.text}>Invite by link:</p>
        <div className={classes["input-holder"]}>
          {newGameLink ? (
            <div className={classes["game-link"]}>
              <div
                className={classes["link-display"]}
                onMouseLeave={(event) => {
                  showUrlIndicator(event);
                }}
                onMouseEnter={(event) => {
                  showUrlIndicator(event);
                }}
                onClick={() => {
                  copyUrl();
                }}
              >
                <p className={classes.link}>{newGameLink.gameUrl}</p>
                <span ref={indRef}>Copy</span>
              </div>
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
