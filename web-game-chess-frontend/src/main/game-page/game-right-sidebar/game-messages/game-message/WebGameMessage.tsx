import { Guid } from "guid-typescript";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import { GameEndReason, MessageType } from "../../../../../shared/utils/objects/entitiesEnums";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { GetAllMessagesDto, GetPlayerDto } from "../../../../../shared/utils/types/gameDtos";
import { EndGameModel, SendGameMessageModel } from "../../../../../shared/utils/types/gameModels";
import classes from "./GameMessage.module.scss";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../../shared/svgs/iconsMap/SymbolIcons";

type WebGameMessageProps = {
  // game id
  gameId: Guid;
  // player data
  playerData: GetPlayerDto;
  // message dto
  message: GetAllMessagesDto;
};

function WebGameMessage({ gameId, playerData, message }: WebGameMessageProps) {
  ///

  const { showPopup } = usePopup();

  // to send message about draw action
  const sendGameMessage = async (message: string): Promise<void> => {
    try {
      const model: SendGameMessageModel = {
        gameId: gameId,
        message: message,
      };

      await GameHubService.SendGameMessage(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // accept/ decline draw offer
  const onAcceptDraw = async (): Promise<void> => {
    try {
      const loserPlayer: EndGameModel = {
        gameId: gameId,
        loserColor: null,
        endGameType: GameEndReason.agreement,
      };

      await GameHubService.EndGame(loserPlayer);

      await GameHubService.RemoveDrawMessage(gameId);

      await sendGameMessage("Draw accepted.");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const onDeclineDraw = async (): Promise<void> => {
    try {
      await GameHubService.RemoveDrawMessage(gameId);

      await sendGameMessage("Draw declined.");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.message}>
      <div className={classes.message__user}>
        {message.type === MessageType.drawAction || message.type === MessageType.bot ? (
          <AvatarImage
            username={message.senderName}
            profilePicture={"/icons/logo.png"}
            containerClass={classes.message__user}
            imageClass={classes["game-logo"]}
          />
        ) : (
          <AvatarImage
            username={message.senderName}
            profilePicture={message.senderImage}
            containerClass={classes.message__user}
            imageClass={classes["sender-image"]}
          />
        )}
      </div>

      <div className={classes.message__content}>
        <p className={classes["sender-data"]}>
          {message.senderName}: {new Date(message.sentAt).toLocaleTimeString()}
        </p>
        <span className={classes["mess-text"]}>{message.message}</span>
      </div>

      {message.type === MessageType.drawAction && message.requestorName != playerData.name && (
        <div className={classes.message__actions}>
          <button
            className={`
              ${classes["draw-mess-btn"]}
              ${classes["accept-btn"]}
            `}
            onClick={() => {
              onAcceptDraw();
            }}
          >
            <IconCreator icons={symbolIcons} iconName={"success"} iconClass={classes["draw-mess-icon"]} />
            <span>Accept</span>
          </button>

          <button
            className={`
              ${classes["draw-mess-btn"]}
              ${classes["decline-btn"]}
            `}
            onClick={() => {
              onDeclineDraw();
            }}
          >
            <IconCreator icons={symbolIcons} iconName={"error"} iconClass={classes["draw-mess-icon"]} />
            <span>Decline</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default WebGameMessage;
