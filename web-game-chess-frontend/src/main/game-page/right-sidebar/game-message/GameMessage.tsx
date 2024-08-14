import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { GetAllMessagesDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameMessage.module.scss";

type GameMessageProps = {
  // message dto
  message: GetAllMessagesDto;
};

function GameMessage({ message }: GameMessageProps) {
  return (
    <div className={classes.message}>
      <div className={classes.message__user}>
        <AvatarImage
          username={message.senderName}
          imageUrl={message.senderImage}
          containerClass={classes.message__user}
          imageClass={classes["sender-image"]}
        />
      </div>
      <div className={classes.message__content}>
        <p className={classes["sender-data"]}>
          {message.senderName}: {new Date(message.sentAt).toLocaleTimeString()}
        </p>
        <span className={classes["mess-text"]}>{message.message}</span>
      </div>
    </div>
  );
}

export default GameMessage;
