import { intToChar } from "../../../../shared/utils/functions/gameRelated";
import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import { GetPlayerDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardCoordinates.module.scss";

type GameBoardCoordinatesProps = {
  // player data to get side
  playerData: GetPlayerDto;
};

function GameBoardCoordinates({ playerData }: GameBoardCoordinatesProps) {
  ///

  return (
    <div className={classes.coordinates}>
      <div
        className={`${classes.coordinates__rows} ${
          playerData.color === pieceColor.black ? classes["black-indicators"] : classes["white-indicators"]
        }`}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1)
          .reverse()
          .map((row, i) => (
            <div key={`row${i}`}>{row}</div>
          ))}
      </div>
      <div
        className={`${classes.coordinates__columns} ${
          playerData.color === pieceColor.black ? classes["black-indicators"] : classes["white-indicators"]
        }`}
      >
        {Array.from({ length: 8 }, (_, i) => intToChar(i + 1)).map((row, i) => (
          <div key={`col${i}`}>{row}</div>
        ))}
      </div>
    </div>
  );
}

export default GameBoardCoordinates;
