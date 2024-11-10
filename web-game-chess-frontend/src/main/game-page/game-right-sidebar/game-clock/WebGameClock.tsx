import { useEffect, useState } from "react";
import { makeTimeFromMinutes } from "../../../../shared/utils/functions/datetime";
import { GameEndReason, PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { EndGameDto, FetchTimeDto, GetEndedGameDto, GetWebGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameClock.module.scss";
import { Guid } from "guid-typescript";
import { EndGameModel } from "../../../../shared/utils/types/gameModels";
import GameHubService from "../../../../shared/utils/services/GameHubService";

type WebGameClockProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetWebGameDto;
  // player data
  playerData: PlayerDto;
  // times for both players
  playersTimes: FetchTimeDto | null;
  // winner data if game has ended
  winner: EndGameDto | GetEndedGameDto | null;
};

function WebGameClock({ gameId, gameData, playerData, playersTimes, winner }: WebGameClockProps) {
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
  //*/

  // sets time left for both players
  useEffect(() => {
    if (playersTimes === null || gameData.hasEnded || winner !== null) return;

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
  }, [gameData, winner]);

  useEffect(() => {
    if (localWhiteTime <= 0 && playersTimes) {
      GameHubService.EndGame({ gameId, loserColor: PieceColor.white, endGameType: GameEndReason.outOfTime });
    }
    if (localBlackTime <= 0 && playersTimes) {
      GameHubService.EndGame({ gameId, loserColor: PieceColor.black, endGameType: GameEndReason.outOfTime });
    }
  }, [localWhiteTime, localBlackTime, gameId, playersTimes]);
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

export default WebGameClock;
