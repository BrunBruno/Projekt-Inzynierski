import { useEffect, useState } from "react";
import AvatarSvg from "../../../shared/svgs/AvatarSvg";
import PiecesSvgs from "../../../shared/svgs/PiecesSvgs";
import { makeTimeFromMinutes } from "../../../shared/utils/functions/dateTimeRelated";
import { GetGameDto } from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";

type RightSideBarProps = {
  gameData: GetGameDto;
  whitePlayerSeconds: number;
  blackPlayerSeconds: number;
  setWhitePlayerSeconds: React.Dispatch<React.SetStateAction<number>>;
  setBlackPlayerSeconds: React.Dispatch<React.SetStateAction<number>>;
};

function RightSideBar({
  gameData,
  whitePlayerSeconds,
  blackPlayerSeconds,
  setWhitePlayerSeconds,
  setBlackPlayerSeconds,
}: RightSideBarProps) {
  useEffect(() => {
    const whiteTick = () => {
      setWhitePlayerSeconds((prevSeconds) =>
        prevSeconds > 0 ? prevSeconds - 1 : 0
      );
    };
    const blackTick = () => {
      setBlackPlayerSeconds((prevSeconds) =>
        prevSeconds > 0 ? prevSeconds - 1 : 0
      );
    };

    let interval: number;
    if (gameData.turn % 2 === 0) {
      interval = setInterval(whiteTick, 1000);
    } else {
      interval = setInterval(blackTick, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameData]);

  const showTime = (seconds: number): (string | JSX.Element)[] => {
    const minutes = seconds / 60;
    const time = makeTimeFromMinutes(minutes);
    const parts = time.split(":");

    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      elements.push(parts[i]);
      if (i < parts.length - 1) {
        elements.push(<span key={`colon-${i}`}>:</span>);
      }
    }

    return elements;
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        <div className={classes.bar__content__header}>
          <div
            className={`${classes.bar__content__header__player} ${classes["white-player"]}`}
          >
            <div className={classes["white-player-img"]}>
              {gameData.whitePlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={gameData.whitePlayer.imageUrl}
                  alt="white-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{gameData.whitePlayer.name}</span>
              <span>
                (<span>{gameData.whitePlayer.elo}</span>)
              </span>
            </div>
          </div>
          <p>vs</p>
          <div
            className={`${classes.bar__content__header__player} ${classes["black-player"]}`}
          >
            <div className={classes["black-player-img"]}>
              {gameData.blackPlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={gameData.blackPlayer.imageUrl}
                  alt="black-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{gameData.blackPlayer.name}</span>
              <span>
                (<span>{gameData.blackPlayer.elo}</span>)
              </span>
            </div>
          </div>
        </div>

        <div className={classes["time-control"]}>
          <div className={classes.time}>{showTime(whitePlayerSeconds)}</div>
          <div className={classes.time}>{showTime(blackPlayerSeconds)}</div>
        </div>

        <div className={classes.bar__content__history}>
          <div className={classes.bar__content__history__list}>
            {gameData.moves.map((move, i) => {
              const turn = Math.floor((move.turn - 1) / 2) + 1;

              return (
                <div
                  key={i}
                  className={classes.bar__content__history__list__record}
                >
                  {i % 2 === 0 ? (
                    <p className={classes.turn}>{turn + ". "}</p>
                  ) : (
                    <p className={classes.sep}>:</p>
                  )}
                  <p className={classes.move}>
                    <PiecesSvgs
                      iconName={move.move[0].toLowerCase()}
                      color={i % 2 === 0}
                    />
                    <span>
                      {move.move.charAt(0).toUpperCase() +
                        move.move.slice(1).toLowerCase()}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={classes.bar__content__actions}></div>
      </div>
    </section>
  );
}

export default RightSideBar;
