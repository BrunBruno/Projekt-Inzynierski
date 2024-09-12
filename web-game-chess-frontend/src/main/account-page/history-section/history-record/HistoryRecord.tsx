import { GetTypeHistoryDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./HistoryRecord.module.scss";

type HistoryRecordProps = {
  // card data
  item: GetTypeHistoryDto;
};

function HistoryRecord({ item }: HistoryRecordProps) {
  ///

  return (
    <div
      className={`
      ${classes.record}
      ${item.isWinner === null ? "" : item.isWinner === true ? classes.win : classes.lose}
    `}
    >
      <span>
        {item.whitePlayer} vs {item.blackPlayer}
      </span>
      <span>{item.prevElo}</span>
      <span>{item.moves}</span>
      <span>{new Date(item.createdAt).toDateString()}</span>
    </div>
  );
}

export default HistoryRecord;
