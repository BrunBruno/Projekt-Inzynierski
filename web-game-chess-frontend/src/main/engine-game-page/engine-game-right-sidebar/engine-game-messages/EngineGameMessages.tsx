import { useEffect, useRef, useState } from "react";
import classes from "./EngineGameMessages.module.scss";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import axios from "axios";
import { getAuthorization, engineController } from "../../../../shared/utils/services/ApiService";
import { Guid } from "guid-typescript";
import EngineGameMessage from "./engine-game-message/EngineGameMessage";
import { GetAllEngineGameMessagesDto } from "../../../../shared/utils/types/engineDtos";

type EngineGameMessagesProps = {
  // game id
  gameId: Guid;
};

function EngineGameMessages({ gameId }: EngineGameMessagesProps) {
  ///

  const { showPopup } = usePopup();

  // ref for messages list
  const listRef = useRef<HTMLDivElement>(null);

  // all messages created during game
  const [messages, setMessages] = useState<GetAllEngineGameMessagesDto[]>([]);
  // typing dots display

  // gets all messages for current game
  const getMessages = async (): Promise<void> => {
    try {
      const response = await axios.get<GetAllEngineGameMessagesDto[]>(
        engineController.getAllEngineGameMessages(gameId),
        getAuthorization()
      );

      setMessages(response.data);

      handleMessagesScroll();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const handleMessagesScroll = (): void => {
    setTimeout(() => {
      const elements = listRef.current;

      if (elements && elements.scrollTop > 0.9 * (elements.scrollHeight - elements.clientHeight)) {
        elements.scrollTop = elements.scrollHeight;
      }
    }, 10);
  };

  useEffect(() => {
    getMessages();
  }, [gameId]);

  return (
    <div className={classes.messages}>
      <div ref={listRef} className={classes.messages__list}>
        {messages.map((message, i) => (
          <EngineGameMessage key={i} message={message} />
        ))}
      </div>
    </div>
  );
}

export default EngineGameMessages;
