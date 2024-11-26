import { useEffect, useRef, useState } from "react";
import classes from "./GameMessages.module.scss";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import axios from "axios";
import { getAuthorization, engineGameController } from "../../../../shared/utils/services/ApiService";
import { Guid } from "guid-typescript";
import EngineGameMessage from "./game-message/EngineGameMessage";
import { GetAllEngineGameMessagesDto } from "../../../../shared/utils/types/engineGameDtos";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";

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
        engineGameController.getAllEngineGameMessages(gameId),
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
          <EngineGameMessage key={i} message={message} />
        ))}
      </div>
    </div>
  );
}

export default EngineGameMessages;
