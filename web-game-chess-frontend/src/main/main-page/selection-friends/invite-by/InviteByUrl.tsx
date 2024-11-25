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
import { InviteByUrlRef } from "../FriendSelectionData";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import axios from "axios";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { CreatePrivateGameWithLinkModel } from "../../../../shared/utils/types/webGameModels";
import { CreatePrivateGameWithLinkDto } from "../../../../shared/utils/types/webGameDtos";
import { getEnumValueByKey } from "../../../../shared/utils/functions/enums";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";

type InviteByUrlProps = {
  // to set obtained url
  setSelectedByUrl: Dispatch<SetStateAction<boolean>>;
};

const InviteByUrl = forwardRef<InviteByUrlRef, InviteByUrlProps>(
  ({ setSelectedByUrl }: InviteByUrlProps, ref: ForwardedRef<InviteByUrlRef>) => {
    ///

    const { showPopup } = usePopup();

    // indicator ref
    const indRef = useRef<HTMLElement>(null);

    // obtained data from creating game by link
    const [newGameLink, setNewGameLink] = useState<CreatePrivateGameWithLinkDto | null>(null);

    // invite to game by url
    // obtains game link
    const onInviteByUrl = async (header: string, values: [number, number]): Promise<void> => {
      const typeValue = getEnumValueByKey(TimingType, header.toLowerCase());

      const model: CreatePrivateGameWithLinkModel = {
        type: typeValue,
        minutes: values[0],
        increment: values[1],
      };

      try {
        const response = await axios.post<CreatePrivateGameWithLinkDto>(
          webGameController.createGameWithLink(),
          model,
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

    // to display time selection for generating new game link
    const onSelectByUrl = (): void => {
      setSelectedByUrl(true);
    };

    // auto copy icon display
    const showUrlIndicator = (event: MouseEvent<HTMLDivElement>): void => {
      const indEle = indRef.current;
      const parentContainer = event.currentTarget;

      if (!indEle) return;

      if (indEle.classList.contains(classes.show)) {
        indEle.classList.remove(classes.show);
      } else {
        indEle.classList.add(classes.show);

        const rect = parentContainer.getBoundingClientRect();

        indEle.style.left = `${event.clientX - rect.left}px`;
      }
    };

    // auto url copy
    const copyUrl = async (): Promise<void> => {
      if (!newGameLink) return;

      const textToCopy = newGameLink.gameUrl;

      await navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showPopup("LINK COPIED", "info");
        })
        .catch(() => {
          showPopup("ERROR COPING LINK", "warning");
        });
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
              <span>Generate</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default InviteByUrl;
