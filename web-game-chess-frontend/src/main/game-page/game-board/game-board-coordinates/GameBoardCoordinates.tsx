import { intToChar } from "../../../../shared/utils/functions/gameRelated";
import { PieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import classes from "./GameBoardCoordinates.module.scss";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";

type GameBoardCoordinatesProps = {
  // player data to get side
  playerData: GetPlayerDto;
};

function GameBoardCoordinates({ playerData }: GameBoardCoordinatesProps) {
  ///

  return (
    <div className={classes.coordinates}>
      {/* /display ranks */}
      <div
        className={`${classes.coordinates__rows} ${
          playerData.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]
        }`}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1)
          .reverse()
          .map((row, i) => (
            <div key={`row${i}`}>{row}</div>
          ))}
      </div>
      {/* --- */}

      {/* display files */}
      <div
        className={`${classes.coordinates__columns} ${
          playerData.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]
        }`}
      >
        {Array.from({ length: 8 }, (_, i) => intToChar(i + 1)).map((row, i) => (
          <div key={`col${i}`}>{row}</div>
        ))}
      </div>
      {/* --- */}
    </div>
  );
}

export default GameBoardCoordinates;
