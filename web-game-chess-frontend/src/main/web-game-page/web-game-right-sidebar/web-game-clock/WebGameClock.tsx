import { makeTimeFromMinutes } from "../../../../shared/utils/functions/datetime";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { GetGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./WebGameClock.module.scss";

type WebGameClockProps = {
  // game data
  gameData: GetGameDto;
  // player data
  playerData: PlayerDto;
  // time left for white player
  whitePlayerSeconds: number;
  // time left for black player
  blackPlayerSeconds: number;
};

function WebGameClock({ gameData, playerData, whitePlayerSeconds, blackPlayerSeconds }: WebGameClockProps) {
  ///

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
        {playerData.color === PieceColor.white ? showTime(whitePlayerSeconds) : showTime(blackPlayerSeconds)}
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
        {playerData.color === PieceColor.black ? showTime(whitePlayerSeconds) : showTime(blackPlayerSeconds)}
      </div>
    </div>
  );
}

export default WebGameClock;
