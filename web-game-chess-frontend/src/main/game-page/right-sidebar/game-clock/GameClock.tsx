import { makeTimeFromMinutes } from "../../../../shared/utils/functions/dateTimeRelated";
import { GetGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameClock.module.scss";

type GameClockProps = {
  // game data
  gameData: GetGameDto;
  // time left for white player
  whitePlayerSeconds: number;
  // time left for black player
  blackPlayerSeconds: number;
};

function GameClock({ gameData, whitePlayerSeconds, blackPlayerSeconds }: GameClockProps) {
  ///

  // to display time on clock
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
    <div className={classes.clock}>
      <div
        className={`
          ${classes.time} 
          ${gameData.turn % 2 === 0 ? classes.active : ""}
        `}
      >
        {showTime(whitePlayerSeconds)}
      </div>
      <div
        className={`
      ${classes.time} 
      ${gameData.turn % 2 === 1 ? classes.active : ""}
    `}
      >
        {showTime(blackPlayerSeconds)}
      </div>
    </div>
  );
}

export default GameClock;
