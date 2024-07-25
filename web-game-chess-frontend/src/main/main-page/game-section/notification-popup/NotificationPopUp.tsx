import { useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { InvitedToGameDto } from "../../../../shared/utils/types/gameDtos";
import {
  AcceptInvitationModel,
  DeclineInvitationModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { useTimingType } from "../../../../shared/utils/hooks/useTimingType";

type NotificationPopUpProps = {
  allowNotification: boolean;
  setAllowNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

function NotificationPopUp({ allowNotification, setAllowNotification }: NotificationPopUpProps) {
  ///

  const [notification, setNotification] = useState<InvitedToGameDto | null>(null);

  const { showPopup } = usePopup();

  const { setTimingType } = useTimingType();

  const handleNotificationChange = (invitationDto: InvitedToGameDto): void => {
    const timing: SearchGameModel = {
      type: invitationDto.type,
      minutes: invitationDto.minutes,
      increment: invitationDto.increment,
    };

    console.log(timing);

    setTimingType(timing);

    setNotification(invitationDto);
  };

  useEffect(() => {
    if (allowNotification && GameHubService.connection) {
      GameHubService.connection.on("InvitedToGame", handleNotificationChange);
    }

    return () => {
      if (allowNotification && GameHubService.connection) {
        GameHubService.connection.off("InvitededToGame", handleNotificationChange);
      }
    };
  }, [allowNotification]);

  // to accept incoming game invitation
  const onAcceptInvitation = async (): Promise<void> => {
    if (!notification) return;

    try {
      const model: AcceptInvitationModel = {
        gameId: notification.gameId,
        inviteeId: notification.inviteeId,
        invitorId: notification.inviterId,
      };

      await GameHubService.AcceptInvitation(model);

      setNotification(null);
      setAllowNotification(false);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to declain incoming game invitation
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
