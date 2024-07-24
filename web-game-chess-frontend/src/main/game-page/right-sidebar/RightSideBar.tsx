import { useEffect } from "react";
import { GetGameDto } from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { endGameTypes, pieceColor } from "../../../shared/utils/enums/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import MoveRecord from "./move-record/MoveRecord";
import GameClock from "./game-clock/GameClock";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";

type RightSideBarProps = {
  // game id
  gameId: string;
  // game data
  gameData: GetGameDto;
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
  whitePlayerSeconds,
  blackPlayerSeconds,
  setWhitePlayerSeconds,
  setBlackPlayerSeconds,
}: RightSideBarProps) {
  ///

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

  const endGame = async (loserColor: number | null, endGameType: number) => {
    const loserPlayer: EndGameModel = {
      gameId: gameId,
      loserColor: loserColor,
      endGameType: endGameType,
    };

    GameHubService.EndGame(loserPlayer);
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

        <div className={classes.bar__content__actions}></div>
      </div>
    </section>
  );
}

export default RightSideBar;
