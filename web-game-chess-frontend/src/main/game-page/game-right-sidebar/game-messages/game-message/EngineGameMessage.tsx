import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import { GetAllEngineGameMessagesDto } from "../../../../../shared/utils/types/engineDtos";
import classes from "./GameMessage.module.scss";

type EngineGameMessageProps = {
  // message dto
  message: GetAllEngineGameMessagesDto;
};

function EngineGameMessage({ message }: EngineGameMessageProps) {
  ///

  return (
    <div className={classes.message}>
      <div className={classes.message__user}>
        <AvatarImage
          username={message.senderName}
          profilePicture={"/icons/logo.png"}
          containerClass={classes.message__user}
          imageClass={classes["game-logo"]}
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

export default EngineGameMessage;
