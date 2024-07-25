import PiecesSvgs from "../../../../shared/svgs/PiecesSvgs";
import { GetGameMoveDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./MoveRecord.module.scss";

type MoveRecordProps = {
  recordNum: number;
  move: GetGameMoveDto;
};

function MoveRecord({ recordNum, move }: MoveRecordProps) {
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
