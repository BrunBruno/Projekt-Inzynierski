import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { specialPiecesSvgs } from "../../../../shared/svgs/SpecialPiecesSvgs";
import { mainColor } from "../../../../shared/utils/enums/colorMaps";
import { MoveDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import classes from "./MoveRecord.module.scss";

type MoveRecordProps = {
  // turn number
  recordNum: number;
  // done move dto
  move: MoveDto;
};

function MoveRecord({ recordNum, move }: MoveRecordProps) {
  ///

  const turn = Math.floor((move.turn - 1) / 2) + 1;

  return (
    <div className={classes.record}>
      {recordNum % 2 === 0 ? <p className={classes.turn}>{turn + ". "}</p> : <p className={classes.sep}>:</p>}
      <p className={classes.move}>
        <IconCreator
          icons={specialPiecesSvgs}
          iconName={move.move[0].toLowerCase()}
          color={recordNum % 2 === 0 ? mainColor.c0 : mainColor.c9}
        />
        <span>{move.move.charAt(0).toUpperCase() + move.move.slice(1).toLowerCase()}</span>
      </p>
    </div>
  );
}

export default MoveRecord;
