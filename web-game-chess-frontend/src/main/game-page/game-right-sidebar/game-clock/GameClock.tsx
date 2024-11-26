import { useEffect, useState } from "react";
import { makeTimeFromMinutes } from "../../../../shared/utils/functions/datetime";
import { GameEndReason, PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { FetchTimeDto, GetWebGameDto } from "../../../../shared/utils/types/webGameDtos";
import classes from "./GameClock.module.scss";
import { Guid } from "guid-typescript";
import { EndWebGameModel } from "../../../../shared/utils/types/webGameModels";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineGameDtos";

type GameClockProps = {
  // game and player data
  gameId: Guid;
  gameData: GetWebGameDto | GetEngineGameDto;
  playerData: PlayerDto;
  // times for both players
  playersTimes: FetchTimeDto | null;
};

function GameClock({ gameId, gameData, playerData, playersTimes }: GameClockProps) {
  ///

  const [localWhiteTime, setLocalWhiteTime] = useState<number>(playersTimes?.whiteTimeLeft || 0);
  const [localBlackTime, setLocalBlackTime] = useState<number>(playersTimes?.blackTimeLeft || 0);

  // to display time on clock
  const showTime = (seconds: number): (string | JSX.Element)[] => {
    const minutes: number = seconds / 60 <= 0 ? 0 : seconds / 60;
    const time: string = makeTimeFromMinutes(minutes);
    const parts: string[] = time.split(":");

    const elements: (string | JSX.Element)[] = [];
    for (let i = 0; i < parts.length; i++) {
      elements.push(parts[i]);

      if (i < parts.length - 1) {
        elements.push(<span key={`colon-${i}`}>:</span>);
      }
    }

    return elements;
  };

  // sets time left for both players
  useEffect(() => {
    if (playersTimes === null || gameData.hasEnded) return;

    const tick = () => {
      if (gameData.turn % 2 === 0) {
        setLocalWhiteTime((prev) => Math.max(prev - 1, 0));
      } else {
        setLocalBlackTime((prev) => Math.max(prev - 1, 0));
      }
    };

    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameData]);

  useEffect(() => {
    if (localWhiteTime <= 0 && playersTimes) {
      GameHubService.EndGame({ gameId, loserColor: PieceColor.white, endGameType: GameEndReason.outOfTime });
    }
    if (localBlackTime <= 0 && playersTimes) {
      GameHubService.EndGame({ gameId, loserColor: PieceColor.black, endGameType: GameEndReason.outOfTime });
    }
  }, [localWhiteTime, localBlackTime, gameId, playersTimes]);

  // to finish game by time outage
  const endGame = async (loserColor: number | null, endGameType: number): Promise<void> => {
    const loserPlayer: EndWebGameModel = {
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

  if (!playersTimes) return <></>;

  return (
    <div className={classes.clock}>
      <div
        className={`
          ${classes.time}
          ${
            (gameData.turn % 2 === 0 && playerData.color === PieceColor.white) ||
            (gameData.turn % 2 === 1 && playerData.color === PieceColor.black)
              ? classes.active
              : ""
          }
          ${playerData.color === PieceColor.white ? classes["white-time"] : classes["black-time"]}
        `}
      >
        {playerData.color === PieceColor.white ? showTime(localWhiteTime) : showTime(localBlackTime)}
      </div>
      <div
        className={`
          ${classes.time}
          ${
            (gameData.turn % 2 === 1 && playerData.color !== PieceColor.black) ||
            (gameData.turn % 2 === 0 && playerData.color !== PieceColor.white)
              ? classes.active
              : ""
          }
          ${playerData.color === PieceColor.black ? classes["white-time"] : classes["black-time"]}
        `}
      >
        {playerData.color === PieceColor.black ? showTime(localWhiteTime) : showTime(localBlackTime)}
      </div>
    </div>
  );
}

export default GameClock;
