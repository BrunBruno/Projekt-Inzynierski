import { useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { InvitedToGameDto } from "../../../../shared/utils/types/gameDtos";
import { AcceptInvitationModel } from "../../../../shared/utils/types/gameModels";

type NotificationPopUpProps = {
  allowNotification: boolean;
};

function NotificationPopUp({ allowNotification }: NotificationPopUpProps) {
  const [notification, setNotification] = useState<InvitedToGameDto | null>(
    null
  );

  const handleNotificationChange = (invitationDto: InvitedToGameDto): void => {
    console.log("invited");
    setNotification(invitationDto);
  };

  useEffect(() => {
    if (allowNotification && GameHubService.connection) {
      console.log("in notification added");

      GameHubService.connection.on("InvitedToGame", handleNotificationChange);
    }

    return () => {
      if (allowNotification && GameHubService.connection) {
        console.log("in notification removed");

        GameHubService.connection.off(
          "InvitededToGame",
          handleNotificationChange
        );
      }
    };
  }, [allowNotification]);

  const onAcceptInvitation = () => {
    if (!notification) return;

    const model: AcceptInvitationModel = {
      gameId: notification.gameId,
      inviteeId: notification.inviteeId,
      invitorId: notification.inviterId,
    };

    GameHubService.AcceptInvitation(model);
  };

  const onDeclineInvitation = () => {};

  if (!notification) {
    return <></>;
  }

  return (
    <div
      className={`
        ${classes.notification}
        ${notification ? classes["show-notification"] : ""}
      `}
    >
      <div className={classes.notification__content}>
        <div className={classes.notification__content__board}></div>
        <div className={classes.notification__content__data}>
          <div className={classes.notification__content__data__header}>
            <span>New game invitation from:</span>
            <br />
            <span className={classes.user}>{notification.inviter} </span>
          </div>
          <div className={classes.notification__content__data__actions}>
            <button
              className={classes.accept}
              onClick={() => {
                onAcceptInvitation();
              }}
            >
              accept
            </button>
            <button
              className={classes.decline}
              onClick={() => {
                onDeclineInvitation();
              }}
            >
              decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopUp;
