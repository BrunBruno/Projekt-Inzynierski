import { Dispatch, SetStateAction, useEffect } from "react";
import { EndGameDto, FetchTimeDto, GetEndedGameDto, GetGameDto } from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import MoveRecord from "./move-record/MoveRecord";
import GameClock from "./game-clock/GameClock";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import GameMessages from "./game-messages/GameMessages";

type RightSideBarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetGameDto;
  // times left for players
  playersTimes: FetchTimeDto | null;
  // time left setter
  setPlayersTimes: Dispatch<SetStateAction<FetchTimeDto | null>>;
  // winner dto of the game
  winner: EndGameDto | GetEndedGameDto | null;
};

function RightSideBar({ gameId, gameData, playersTimes, setPlayersTimes, winner }: RightSideBarProps) {
  ///

  // sets time left for both players
  useEffect(() => {
    if (playersTimes === null || gameData.hasEnded || winner !== null) return;

    const whiteTick = (): void => {
      setPlayersTimes((prevTimes) => {
        if (!prevTimes) return null;
        return {
          ...prevTimes,
          whiteTimeLeft: prevTimes.whiteTimeLeft > 0 ? prevTimes.whiteTimeLeft - 1 : 0,
        };
      });
    };

    const blackTick = (): void => {
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
      endGame(PieceColor.white, GameEndReason.outOfTime);
    }
    if (playersTimes !== null && playersTimes.blackTimeLeft <= 0) {
      endGame(PieceColor.black, GameEndReason.outOfTime);
    }
  }, [playersTimes]);
  //*/

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/* players data */}
        <div className={classes.bar__content__header}>
          <div className={`${classes.bar__content__header__player} ${classes["white-player"]}`}>
            <AvatarImage
              username={gameData.whitePlayer.name}
              profilePicture={gameData.whitePlayer.profilePicture}
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
              profilePicture={gameData.blackPlayer.profilePicture}
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
        {playersTimes === null ? (
          <LoadingPage text="Fetching time..." />
        ) : (
          <GameClock
            gameData={gameData}
            whitePlayerSeconds={playersTimes.whiteTimeLeft}
            blackPlayerSeconds={playersTimes.blackTimeLeft}
          />
        )}
        {/* --- */}

        {/* game history records */}
        <div className={classes.bar__content__block}>
          <div className={classes.bar__content__block__list}>
            {gameData.moves.length > 0
              ? gameData.moves.map((move, i) => <MoveRecord key={i} recordNum={i} move={move} />)
              : Array.from({ length: 10 }).map((_, i) => <MoveRecord key={i} recordNum={i} move={null} />)}
          </div>
        </div>
        {/* --- */}

        {/* game messenger */}
        <div className={classes.bar__content__block}>
          <GameMessages gameId={gameId} />
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default RightSideBar;
