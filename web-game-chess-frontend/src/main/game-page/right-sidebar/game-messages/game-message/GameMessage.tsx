import { Guid } from "guid-typescript";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import { GameEndReason, MessageType } from "../../../../../shared/utils/objects/entitiesEnums";
import { getErrMessage } from "../../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../../shared/utils/hooks/usePopUp";
import GameHubService from "../../../../../shared/utils/services/GameHubService";
import { GetAllMessagesDto } from "../../../../../shared/utils/types/gameDtos";
import { EndGameModel } from "../../../../../shared/utils/types/gameModels";
import classes from "./GameMessage.module.scss";

type GameMessageProps = {
  // game id
  gameId: Guid;
  // message dto
  message: GetAllMessagesDto;
};

function GameMessage({ gameId, message }: GameMessageProps) {
  ///

  const { showPopup } = usePopup();

  // accept/ decline draw offer
  const onAcceptDraw = async (): Promise<void> => {
    try {
      const loserPlayer: EndGameModel = {
        gameId: gameId,
        loserColor: null,
        endGameType: GameEndReason.agreement,
      };

      await GameHubService.EndGame(loserPlayer);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const onDeclineDraw = async (): Promise<void> => {
    try {
      await GameHubService.RemoveDrawMessage(gameId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

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

      {message.type === MessageType.drawAction && (
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
            <span>Decline</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default GameMessage;
