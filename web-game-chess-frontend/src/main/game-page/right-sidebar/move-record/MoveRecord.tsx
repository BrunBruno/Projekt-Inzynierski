import PiecesSvgs from "../../../../shared/svgs/PiecesSvgs";
import { MoveDto } from "../../../../shared/utils/types/abstracDtosAndModels";
import classes from "./MoveRecord.module.scss";

type MoveRecordProps = {
  // tuen number
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
        <PiecesSvgs iconName={move.move[0].toLowerCase()} color={recordNum % 2 === 0} />
        <span>{move.move.charAt(0).toUpperCase() + move.move.slice(1).toLowerCase()}</span>
      </p>
    </div>
  );
}

export default MoveRecord;
