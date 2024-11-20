import { ChangeEvent, useEffect, useRef, useState, KeyboardEvent, FormEvent } from "react";
import classes from "./GameMessages.module.scss";
import { GetAllMessagesDto, GetWebGamePlayerDto } from "../../../../shared/utils/types/webGameDtos";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import axios from "axios";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { SendPlayerMessageModel, TypingStatusModel } from "../../../../shared/utils/types/webGameModels";
import { Guid } from "guid-typescript";
import { gameRightSidebarIcons } from "../GameRightSidebarIcons";
import WebGameMessage from "./game-message/WebGameMessage";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";

type WebGameMessagesProps = {
  // game id
  gameId: Guid;
  // player data
  playerData: GetWebGamePlayerDto;
};

function WebGameMessages({ gameId, playerData }: WebGameMessagesProps) {
  ///

  const { showPopup } = usePopup();

  // ref for messages list
  const listRef = useRef<HTMLDivElement>(null);
  // ref for message input
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // state for message input text
  const [newMessage, setNewMessage] = useState<string>("");
  // all messages created during game
  const [messages, setMessages] = useState<GetAllMessagesDto[]>([]);
  // typing dots display
  const [isOpponentTyping, setIsOpponentTyping] = useState<boolean>(false);

  // gets all messages for current game
  // add hub service to send and received messages
  // to receive and update typing status
  useEffect(() => {
    const getMessages = async (): Promise<void> => {
      try {
        const response = await axios.get<GetAllMessagesDto[]>(
          webGameController.getAllMessages(gameId),
          getAuthorization()
        );

        setMessages(response.data);

        handleMessagesScroll(true);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    const handleMessagesScroll = (force: boolean): void => {
      setTimeout(() => {
        const elements = listRef.current;

        if (elements && (elements.scrollTop > 0.9 * (elements.scrollHeight - elements.clientHeight) || force)) {
          elements.scrollTop = elements.scrollHeight;
        }
      }, 10);
    };

    const typingStatusChange = (isTyping: boolean): void => {
      setIsOpponentTyping(isTyping);
      handleMessagesScroll(false);
    };

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

  // to send new message
  const sendMessage = async (): Promise<void> => {
    if (inputRef.current) inputRef.current.blur();

    if (newMessage === "") return;

    try {
      const model: SendPlayerMessageModel = {
        gameId: gameId,
        message: newMessage,
      };

      await GameHubService.SendPlayerMessage(model);

      setNewMessage("");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // handle message input
  const handleMessageInputChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = event.target.value;
    setNewMessage(inputValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onFormAccept = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendMessage();
  };

  const handleTypingStatus = async (isTyping: boolean): Promise<void> => {
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

  const [isLess, setIsLess] = useState<boolean>(window.innerWidth <= 1000);
  const [messagesClosed, setMessagesClose] = useState<boolean>(false);

  // transform messages box on resize
  useEffect(() => {
    const handleMessagesOnResize = (): void => {
      if (window.innerWidth <= 1000 && !isLess) {
        setIsLess(true);
      } else if (window.innerWidth > 1000 && isLess) {
        setIsLess(false);
      }
    };

    window.addEventListener("resize", handleMessagesOnResize);

    return () => {
      window.removeEventListener("resize", handleMessagesOnResize);
    };
  }, [isLess]);

  useEffect(() => {
    if (isLess) {
      setMessagesClose(true);
    } else {
      setMessagesClose(false);
    }
  }, [isLess]);

  // show or hide messages by click
  const showMessages = (): void => {
    if (messagesClosed && window.innerWidth <= 1000) {
      setMessagesClose(false);
    }
  };

  const onHideMessages = (): void => {
    setMessagesClose(true);
  };

  return (
    <div
      className={`${classes.messages} ${messagesClosed ? classes.closed : ""}`}
      onClick={() => {
        showMessages();
      }}
    >
      {window.innerWidth <= 1000 && (
        <div
          className={`${classes["mess-icons"]} ${messagesClosed ? classes["arrow"] : classes["x"]}`}
          onClick={() => {
            onHideMessages();
          }}
        >
          {!messagesClosed ? (
            <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c5} />
          ) : (
            <IconCreator
              icons={symbolIcons}
              iconName={"arrow"}
              iconClass={classes["arrow-icon"]}
              color={greyColor.c5}
            />
          )}
        </div>
      )}

      <div ref={listRef} className={classes.messages__list}>
        {messages.map((message, i) => (
          <WebGameMessage key={i} gameId={gameId} playerData={playerData} message={message} />
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
          <IconCreator icons={gameRightSidebarIcons} iconName={"send"} iconClass={classes["send-svg"]} />
        </button>
      </form>
    </div>
  );
}

export default WebGameMessages;
