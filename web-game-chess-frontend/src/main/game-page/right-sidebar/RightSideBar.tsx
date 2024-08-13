import { useEffect, useRef, useState } from "react";
import { GetAllMessagesDto, GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";
import { EndGameModel, SendMessageModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { endGameTypes, pieceColor } from "../../../shared/utils/enums/entitiesEnums";
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

type RightSideBarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetGameDto;
  // player data
  playerData: GetPlayerDto;
  // time left for white
  whitePlayerSeconds: number | null;
  // time left for black
  blackPlayerSeconds: number | null;
  // setter for white time
  setWhitePlayerSeconds: React.Dispatch<React.SetStateAction<number | null>>;
  // setter for black time
  setBlackPlayerSeconds: React.Dispatch<React.SetStateAction<number | null>>;
};

function RightSideBar({
  gameId,
  gameData,
  playerData,
  whitePlayerSeconds,
  blackPlayerSeconds,
  setWhitePlayerSeconds,
  setBlackPlayerSeconds,
}: RightSideBarProps) {
  ///

  const { showPopup } = usePopup();

  const messagesRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<GetAllMessagesDto[]>([]);

  // sets time left for both players
  useEffect(() => {
    if (whitePlayerSeconds === null || blackPlayerSeconds === null) return;

    const whiteTick = () => setWhitePlayerSeconds((prevSeconds) => (prevSeconds! > 0 ? prevSeconds! - 1 : 0));
    const blackTick = () => setBlackPlayerSeconds((prevSeconds) => (prevSeconds! > 0 ? prevSeconds! - 1 : 0));

    let interval: number;
    if (gameData.turn % 2 === 0) {
      interval = setInterval(whiteTick, 1000);
    } else {
      interval = setInterval(blackTick, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameData, whitePlayerSeconds, blackPlayerSeconds]);

  const endGame = async (loserColor: number | null, endGameType: number): Promise<void> => {
    const loserPlayer: EndGameModel = {
      gameId: gameId,
      loserColor: loserColor,
      endGameType: endGameType,
    };

    await GameHubService.EndGame(loserPlayer);
  };

  useEffect(() => {
    if (whitePlayerSeconds !== null && whitePlayerSeconds <= 0) {
      endGame(pieceColor.white, endGameTypes.outOfTime);
    }
  }, [whitePlayerSeconds]);
  useEffect(() => {
    if (blackPlayerSeconds !== null && blackPlayerSeconds <= 0) {
      endGame(pieceColor.black, endGameTypes.outOfTime);
    }
  }, [blackPlayerSeconds]);

  // gets all messages for current game
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

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (newMessage === "") return;

    try {
      const model: SendMessageModel = {
        gameId: gameId,
        playerId: playerData.playerId,
        message: newMessage,
      };

      await GameHubService.SendMessage(model);

      setNewMessage("");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const handleMessageInputChannge = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setNewMessage(inputValue);
  };

  if (whitePlayerSeconds === null || blackPlayerSeconds === null) return <LoadingPage />;

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
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
          <p>vs</p>
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

        <GameClock
          gameData={gameData}
          whitePlayerSeconds={whitePlayerSeconds}
          blackPlayerSeconds={blackPlayerSeconds}
        />

        <div className={classes.bar__content__history}>
          <div className={classes.bar__content__history__list}>
            {gameData.moves.map((move, i) => (
              <MoveRecord key={i} recordNum={i} move={move} />
            ))}
          </div>
        </div>

        <div className={classes.bar__content__messages}>
          <div ref={messagesRef} className={classes.bar__content__messages__list}>
            {messages.map((message, i) => (
              <GameMessage key={i} message={message} />
            ))}
          </div>
          <form
            className={classes.bar__content__messages__actions}
            onSubmit={(event) => {
              sendMessage(event);
            }}
          >
            <input
              className={classes["message-input"]}
              value={newMessage}
              onChange={(event) => {
                handleMessageInputChannge(event);
              }}
            />
            <button className={classes["send-button"]} type="submit">
              ^
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RightSideBar;
