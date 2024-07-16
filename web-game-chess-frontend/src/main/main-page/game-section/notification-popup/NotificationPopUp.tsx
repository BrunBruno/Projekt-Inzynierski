import { useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { InvitedToGameDto } from "../../../../shared/utils/types/gameDtos";
import {
  AcceptInvitationModel,
  DeclineInvitationModel,
  SearchGameModel,
} from "../../../../shared/utils/types/gameModels";
import axios from "axios";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";

type NotificationPopUpProps = {
  allowNotification: boolean;
  setAllowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  setChoosenTiming: React.Dispatch<
    React.SetStateAction<SearchGameModel | null>
  >;
};

function NotificationPopUp({
  allowNotification,
  setAllowNotification,
  setChoosenTiming,
}: NotificationPopUpProps) {
  ///

  const [notification, setNotification] = useState<InvitedToGameDto | null>(
    null
  );

  const handleNotificationChange = (invitationDto: InvitedToGameDto): void => {
    const timing: SearchGameModel = {
      type: invitationDto.type,
      minutes: invitationDto.minutes,
      increment: invitationDto.increment,
    };

    setChoosenTiming(timing);

    setNotification(invitationDto);
  };

  useEffect(() => {
    if (allowNotification && GameHubService.connection) {
      GameHubService.connection.on("InvitedToGame", handleNotificationChange);
    }

    return () => {
      if (allowNotification && GameHubService.connection) {
        GameHubService.connection.off(
          "InvitededToGame",
          handleNotificationChange
        );
      }
    };
  }, [allowNotification]);

  const onAcceptInvitation = (): void => {
    if (!notification) return;

    const model: AcceptInvitationModel = {
      gameId: notification.gameId,
      inviteeId: notification.inviteeId,
      invitorId: notification.inviterId,
    };

    GameHubService.AcceptInvitation(model);

    setNotification(null);
    setAllowNotification(false);
  };

  const onDeclineInvitation = async (): Promise<void> => {
    if (!notification) return;

    try {
      const model: DeclineInvitationModel = {
        gameId: notification.gameId,
      };

      await axios.delete(
        gameControllerPaths.declineInvitation(model),
        getAuthorization()
      );

      setNotification(null);
      setAllowNotification(false);
    } catch (err) {
      console.log(err);
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
