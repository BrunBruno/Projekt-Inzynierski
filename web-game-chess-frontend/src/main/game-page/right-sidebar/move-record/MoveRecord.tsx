import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { specialPiecesSvgs } from "../../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { MoveDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import classes from "./MoveRecord.module.scss";

type MoveRecordProps = {
  // turn number
  recordNum: number;
  // done move dto
  move: MoveDto | null;
};

function MoveRecord({ recordNum, move }: MoveRecordProps) {
  ///

  // case when game has not started yet
  if (!move) {
    return (
      <div className={`${classes.record} ${classes.empty}`}>
        {recordNum % 2 === 0 ? (
          <p className={classes.turn}>{Math.floor(recordNum / 2) + 1 + ". "}</p>
        ) : (
          <p className={classes.sep}>:</p>
        )}
        <p className={classes.move}>
          <span>---</span>
        </p>
      </div>
    );
  }

  return (
    <div className={classes.record}>
      {recordNum % 2 === 0 ? (
        <p className={classes.turn}>{Math.floor((move.turn - 1) / 2) + 1 + ". "}</p>
      ) : (
        <p className={classes.sep}>:</p>
      )}
      <p className={classes.move}>
        <IconCreator
          icons={specialPiecesSvgs}
          iconName={move.move[0].toLowerCase() as PieceTag}
          color={recordNum % 2 === 0 ? mainColor.c0 : mainColor.c9}
        />
        <span>{move.move.charAt(0).toUpperCase() + move.move.slice(1).toLowerCase()}</span>
      </p>
    </div>
  );
}

export default MoveRecord;
