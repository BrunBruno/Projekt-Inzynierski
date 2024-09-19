import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { InvitedToGameDto } from "../../../../shared/utils/types/gameDtos";
import {
  AcceptInvitationModel,
  DeclineInvitationModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { useTimingType } from "../../../../shared/utils/hooks/useTimingType";
import { HubConnectionState } from "@microsoft/signalr";

type NotificationPopUpProps = {
  // if notification should be displayed
  allowNotification: boolean;
  // to remove notification
  setAllowNotification: Dispatch<SetStateAction<boolean>>;
};

function NotificationPopUp({ allowNotification, setAllowNotification }: NotificationPopUpProps) {
  ///

  const { showPopup } = usePopup();
  const { setTimingType } = useTimingType();

  // received notification content
  const [notification, setNotification] = useState<InvitedToGameDto | null>(null);

  // to obtain notifications
  const handleNotificationChange = (invitationDto: InvitedToGameDto): void => {
    const timing: SearchGameModel = {
      type: invitationDto.type,
      minutes: invitationDto.minutes,
      increment: invitationDto.increment,
    };

    setTimingType(timing);

    setNotification(invitationDto);
  };

  useEffect(() => {
    if (
      allowNotification &&
      GameHubService.connection &&
      GameHubService.connection.state === HubConnectionState.Connected
    ) {
      GameHubService.connection.on("InvitedToGame", handleNotificationChange);
    }

    return () => {
      if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
        GameHubService.connection.off("InvitedToGame", handleNotificationChange);
      }
    };
  }, [allowNotification]);
  //*/

  // to accept incoming game invitation
  const onAcceptInvitation = async (): Promise<void> => {
    if (!notification) return;

    try {
      const model: AcceptInvitationModel = {
        gameId: notification.gameId,
        inviteeId: notification.inviteeId,
        inviterId: notification.inviterId,
      };

      await GameHubService.AcceptInvitation(model);

      setNotification(null);
      setAllowNotification(false);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // to decline incoming game invitation
  const onDeclineInvitation = async (): Promise<void> => {
    if (!notification) return;

    try {
      const model: DeclineInvitationModel = {
        gameId: notification.gameId,
        friendId: notification.inviterId,
      };

      await GameHubService.DeclineInvitation(model);

      setNotification(null);
      setAllowNotification(false);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  if (!notification) return <></>;

  return (
    <div
      className={`
        ${classes.notification}
        ${notification ? classes["show-notification"] : ""}
      `}
    >
      <div className={classes.notification__content}>
        <div className={classes.notification__content__board} />

        <div className={classes.notification__content__data}>
          <div className={classes.notification__content__data__header}>
            <span>New game invitation from:</span>
            <br />
            <span className={classes.user}>{notification.inviter} </span>
          </div>

          {/* invitation actions */}
          <div className={classes.notification__content__data__actions}>
            <button
              className={`${classes["action"]} ${classes["accept"]}`}
              onClick={() => {
                onAcceptInvitation();
              }}
            >
              <span>accept</span>
            </button>

            <button
              className={`${classes["action"]} ${classes["decline"]}`}
              onClick={() => {
                onDeclineInvitation();
              }}
            >
              <span>decline</span>
            </button>
          </div>
          {/* --- */}
        </div>
      </div>
    </div>
  );
}

export default NotificationPopUp;
