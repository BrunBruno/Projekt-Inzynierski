import { useEffect, useRef, useState } from "react";
import GameMessage from "./game-message/GameMessage";
import classes from "./GameMessages.module.scss";
import { GetAllMessagesDto } from "../../../../shared/utils/types/gameDtos";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { rightSideBarIcons } from "../RightSideBarIcons";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { SendMessageModel, TypingStatusModel } from "../../../../shared/utils/types/gameModels";
import { Guid } from "guid-typescript";

type GameMessagesProps = {
  gameId: Guid;
};

function GameMessages({ gameId }: GameMessagesProps) {
  ///

  const { showPopup } = usePopup();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<GetAllMessagesDto[]>([]);

  const [isOpponentTyping, setIsOpponentTyping] = useState<boolean>(false);

  // gets all messages for current game
  // add hub service to send and received messages
  // to receive and update typing status
  const getMessages = async (): Promise<void> => {
    try {
      const response = await axios.get<GetAllMessagesDto[]>(
        gameControllerPaths.getAllMessages(gameId),
        getAuthorization()
      );

      setMessages(response.data);

      handleMessagesScroll();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const typingStatusChange = (isTyping: boolean): void => {
    setIsOpponentTyping(isTyping);
    handleMessagesScroll();
  };

  useEffect(() => {
    getMessages();

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("MessagesUpdated", getMessages);
      GameHubService.connection.on("TypingStatus", typingStatusChange);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("MessagesUpdated", getMessages);
        GameHubService.connection.off("TypingStatus", typingStatusChange);
      }
    };
  }, []);
  //*/

  const handleMessagesScroll = (): void => {
    setTimeout(() => {
      const elements = listRef.current;

      if (elements) {
        if (elements.scrollTop > 0.9 * (elements.scrollHeight - elements.clientHeight)) {
          elements.scrollTop = elements.scrollHeight;
        }
      }
    }, 10);
  };

  // to send new message
  const sendMessage = async (): Promise<void> => {
    if (inputRef.current) inputRef.current.blur();

    if (newMessage === "") return;

    try {
      const model: SendMessageModel = {
        gameId: gameId,
        message: newMessage,
      };

      await GameHubService.SendMessage(model);

      setNewMessage("");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // handle message input
  const handleMessageInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = event.target.value;
    setNewMessage(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onFormAccept = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendMessage();
  };

  const handleTypingStatus = async (isTyping: boolean) => {
    try {
      const model: TypingStatusModel = {
        gameId: gameId,
        isTyping: isTyping,
      };

      await GameHubService.TypingStatus(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.messages}>
      <div ref={listRef} className={classes.messages__list}>
        {messages.map((message, i) => (
          <GameMessage key={i} gameId={gameId} message={message} />
        ))}

        {isOpponentTyping && (
          <div className={classes.typing}>
            <p />
            <p />
            <p />
          </div>
        )}
      </div>

      <form
        className={classes.messages__actions}
        onSubmit={(event) => {
          onFormAccept(event);
        }}
      >
        <textarea
          ref={inputRef}
          className={classes["message-input"]}
          value={newMessage}
          onChange={(event) => {
            handleMessageInputChange(event);
          }}
          onKeyDown={(event) => {
            handleKeyDown(event);
          }}
          onFocus={() => {
            handleTypingStatus(true);
          }}
          onBlur={() => {
            handleTypingStatus(false);
          }}
        ></textarea>

        <button className={classes["send-button"]} type="submit">
          <IconCreator icons={rightSideBarIcons} iconName="send" iconClass={classes["send-svg"]} />
        </button>
      </form>
    </div>
  );
}

export default GameMessages;
