import { useEffect, useRef, useState } from "react";
import {
  EndGameDto,
  FetchTimeDto,
  GetAllMessagesDto,
  GetEndedGameDto,
  GetGameDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";
import { EndGameModel, SendMessageModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { EndGameTypes, PieceColor } from "../../../shared/utils/enums/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import MoveRecord from "./move-record/MoveRecord";
import GameClock from "./game-clock/GameClock";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../shared/utils/services/ApiService";
import GameMessage from "./game-message/GameMessage";
import { HubConnectionState } from "@microsoft/signalr";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { rightSideBarIcons } from "./RightSideBarIcons";

type RightSideBarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetGameDto;
  // times left for players
  playersTimes: FetchTimeDto | null;
  // time left setter
  setPlayersTimes: React.Dispatch<React.SetStateAction<FetchTimeDto | null>>;
  // winner dto of the game
  winner: EndGameDto | GetEndedGameDto | null;
};

function RightSideBar({ gameId, gameData, playersTimes, setPlayersTimes, winner }: RightSideBarProps) {
  ///

  const { showPopup } = usePopup();

  const messagesRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<GetAllMessagesDto[]>([]);

  // sets time left for both players
  useEffect(() => {
    if (playersTimes === null || gameData.hasEnded || winner !== null) return;

    const whiteTick = () => {
      setPlayersTimes((prevTimes) => {
        if (!prevTimes) return null;
        return {
          ...prevTimes,
          whiteTimeLeft: prevTimes.whiteTimeLeft > 0 ? prevTimes.whiteTimeLeft - 1 : 0,
        };
      });
    };

    const blackTick = () => {
      setPlayersTimes((prevTimes) => {
        if (!prevTimes) return null;
        return {
          ...prevTimes,
          blackTimeLeft: prevTimes.blackTimeLeft > 0 ? prevTimes.blackTimeLeft - 1 : 0,
        };
      });
    };

    let interval: NodeJS.Timeout;
    if (gameData.turn % 2 === 0) {
      interval = setInterval(whiteTick, 1000);
    } else {
      interval = setInterval(blackTick, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameData, playersTimes, winner]);
  //*/

  // to finish game by time outage
  const endGame = async (loserColor: number | null, endGameType: number): Promise<void> => {
    const loserPlayer: EndGameModel = {
      gameId: gameId,
      loserColor: loserColor,
      endGameType: endGameType,
    };

    await GameHubService.EndGame(loserPlayer);
  };

  useEffect(() => {
    if (playersTimes !== null && playersTimes.whiteTimeLeft <= 0) {
      endGame(PieceColor.white, EndGameTypes.outOfTime);
    }
    if (playersTimes !== null && playersTimes.blackTimeLeft <= 0) {
      endGame(PieceColor.black, EndGameTypes.outOfTime);
    }
  }, [playersTimes]);
  //*/

  // gets all messages for current game
  // add hub service to send and received messages
  const getMessages = async () => {
    try {
      const response = await axios.get<GetAllMessagesDto[]>(
        gameControllerPaths.getAllMessages(gameId),
        getAuthorization()
      );

      setMessages(response.data);

      setTimeout(() => {
        const elements = messagesRef.current;
        if (elements) {
          elements.scrollTop = elements.scrollHeight;
        }
      }, 10);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    getMessages();

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("MessagesUpdated", getMessages);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("MessagesUpdated", getMessages);
      }
    };
  }, []);
  //*/

  // to send new message
  const sendMessage = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
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
  const handleMessageInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setNewMessage(inputValue);
  };
  //*/

  if (playersTimes === null) return <LoadingPage />;

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/* players data */}
        <div className={classes.bar__content__header}>
          <div className={`${classes.bar__content__header__player} ${classes["white-player"]}`}>
            <AvatarImage
              username={gameData.whitePlayer.name}
              imageUrl={gameData.whitePlayer.imageUrl}
              containerClass={classes["white-player-img"]}
              imageClass={classes["player-img"]}
            />

            <div className={classes["player-data"]}>
              <span>{gameData.whitePlayer.name}</span>
              <span>
                (<span>{gameData.whitePlayer.elo}</span>)
              </span>
            </div>
          </div>

          <p className={classes.vs}>vs</p>

          <div className={`${classes.bar__content__header__player} ${classes["black-player"]}`}>
            <AvatarImage
              username={gameData.blackPlayer.name}
              imageUrl={gameData.blackPlayer.imageUrl}
              containerClass={classes["black-player-img"]}
              imageClass={classes["player-img"]}
            />

            <div className={classes["player-data"]}>
              <span>{gameData.blackPlayer.name}</span>
              <span>
                (<span>{gameData.blackPlayer.elo}</span>)
              </span>
            </div>
          </div>
        </div>
        {/* --- */}

        {/* game clock */}
        <GameClock
          gameData={gameData}
          whitePlayerSeconds={playersTimes.whiteTimeLeft}
          blackPlayerSeconds={playersTimes.blackTimeLeft}
        />
        {/* --- */}

        {/* game history records */}
        <div className={classes.bar__content__history}>
          <div className={classes.bar__content__history__list}>
            {gameData.moves.map((move, i) => (
              <MoveRecord key={i} recordNum={i} move={move} />
            ))}
          </div>
        </div>
        {/* --- */}

        {/* game messenger */}
        <div className={classes.bar__content__messages}>
          <div ref={messagesRef} className={classes.bar__content__messages__list}>
            {messages.map((message, i) => (
              <GameMessage key={i} gameId={gameId} message={message} />
            ))}
          </div>

          <form
            className={classes.bar__content__messages__actions}
            onSubmit={(event) => {
              sendMessage(event);
            }}
          >
            <textarea
              className={classes["message-input"]}
              value={newMessage}
              onChange={(event) => {
                handleMessageInputChange(event);
              }}
            ></textarea>

            <button className={classes["send-button"]} type="submit">
              <IconCreator icons={rightSideBarIcons} iconName="send" />
            </button>
          </form>
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default RightSideBar;
