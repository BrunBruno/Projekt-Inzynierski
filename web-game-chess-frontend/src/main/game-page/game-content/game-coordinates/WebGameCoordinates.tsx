import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import classes from "./GameCoordinates.module.scss";
import { GetWebGamePlayerDto } from "../../../../shared/utils/types/gameDtos";
import { intToChar } from "../../../../shared/utils/chess-game/general";

const fileAndRankSize = 8;

type WebGameCoordinatesProps = {
  // player data to get side
  playerData: GetWebGamePlayerDto;
};

function WebGameCoordinates({ playerData }: WebGameCoordinatesProps) {
  ///

  return (
    <div className={classes.coordinates}>
      {/* /display ranks */}
      <div
        className={`
          ${classes.coordinates__rows} 
          ${playerData.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]}
        `}
      >
        {Array.from({ length: fileAndRankSize }, (_, i) => i + 1)
          .reverse()
          .map((row, i) => (
            <div key={`row${i}`}>{row}</div>
          ))}
      </div>
      {/* --- */}

      {/* display files */}
      <div
        className={`
          ${classes.coordinates__columns} 
          ${playerData.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]}
        `}
      >
        {Array.from({ length: fileAndRankSize }, (_, i) => intToChar(i + 1)).map((row, i) => (
          <div key={`col${i}`}>{row}</div>
        ))}
      </div>
      {/* --- */}
    </div>
  );
}

export default WebGameCoordinates;
