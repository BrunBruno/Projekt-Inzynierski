import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import classes from "./GameBoardCoordinates.module.scss";
import { intToChar } from "../../game-page-functions/general";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineDtos";

const fileAndRankSize = 8;

type GameBoardCoordinatesProps = {
  // player data to get side
  gameData: GetEngineGameDto;
};

function GameBoardCoordinates({ gameData }: GameBoardCoordinatesProps) {
  ///

  return (
    <div className={classes.coordinates}>
      {/* /display ranks */}
      <div
        className={`
          ${classes.coordinates__rows} 
          ${gameData.player.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]}
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
          ${gameData.player.color === PieceColor.black ? classes["black-indicators"] : classes["white-indicators"]}
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

export default GameBoardCoordinates;
