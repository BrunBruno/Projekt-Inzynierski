import { useEffect, useState } from "react";
import classes from "./NotificationPopUp.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";

function NotificationPopUp() {
  const [notification, setNotification] = useState<string | null>(null);

  const handleNotificationChange = (gameId: string, username: string) => {
    setNotification(username);
  };

  useEffect(() => {
    GameHubService.connection?.on("InvitededToGame", handleNotificationChange);

    return () => {};
  }, []);

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
            <span className={classes.user}>{notification} </span>
          </div>
          <div className={classes.notification__content__data__actions}>
            <button className={classes.accept}>accept</button>
            <button className={classes.decline}>decline</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPopUp;
