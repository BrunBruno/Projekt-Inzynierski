import { useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { InvitedToGameDto } from "../../../shared/utils/types/webGameDtos";
import { AcceptInvitationModel, DeclineInvitationModel } from "../../../shared/utils/types/webGameModels";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { HubConnectionState } from "@microsoft/signalr";
import { StateProp } from "../../../shared/utils/types/commonTypes";

type NotificationPopUpProps = {
  // if notification should be displayed and to remove notification
  allowNotificationProp: StateProp<boolean>;
};

function NotificationPopUp({ allowNotificationProp }: NotificationPopUpProps) {
  ///

  const { showPopup } = usePopup();

  // received notification content
  const [notification, setNotification] = useState<InvitedToGameDto | null>(null);

  // to obtain notifications
  const handleNotificationChange = (invitationDto: InvitedToGameDto): void => {
    setNotification(invitationDto);
  };

  useEffect(() => {
    if (
      allowNotificationProp.get &&
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
  }, [allowNotificationProp]);

  // to accept incoming game invitation
  const onAcceptInvitation = async (): Promise<void> => {
    if (!notification) return;

    const model: AcceptInvitationModel = {
      gameId: notification.gameId,
      inviteeId: notification.inviteeId,
      inviterId: notification.inviterId,
    };

    try {
      await GameHubService.AcceptInvitation(model);

      setNotification(null);
      allowNotificationProp.set(false);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to decline incoming game invitation
  const onDeclineInvitation = async (): Promise<void> => {
    if (!notification) return;

    const model: DeclineInvitationModel = {
      gameId: notification.gameId,
      friendId: notification.inviterId,
    };

    try {
      await GameHubService.DeclineInvitation(model);

      setNotification(null);
      allowNotificationProp.set(false);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

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
        </div>
      </div>
    </div>
  );
}

export default NotificationPopUp;
