import { GetTypeHistoryDto } from "../../../../shared/utils/types/webGameDtos";
import classes from "./HistoryRecord.module.scss";

type HistoryRecordProps = {
  // card data
  item: GetTypeHistoryDto | null;
};

function HistoryRecord({ item }: HistoryRecordProps) {
  ///

  if (item === null) {
    return (
      <div
        className={`
          ${classes.record}
          ${classes.header}
        `}
      >
        <p className={classes["record-data"]}>Players</p>
        <p className={classes["record-data"]}>Elo</p>
        <p className={classes["record-data"]}>Turn</p>
        <p className={classes["record-data"]}>Played at</p>
      </div>
    );
  }

  return (
    <div
      className={`
        ${classes.record}
        ${item.isWinner === null ? "" : item.isWinner === true ? classes.win : classes.lose}
      `}
    >
      <p className={classes["record-data"]}>
        {item.whitePlayer} vs {item.blackPlayer}
      </p>
      <p className={classes["record-data"]}>{item.prevElo}</p>
      <p className={classes["record-data"]}>{item.moves}</p>
      <p className={classes["record-data"]}>{new Date(item.createdAt).toDateString()}</p>
    </div>
  );
}

export default HistoryRecord;
