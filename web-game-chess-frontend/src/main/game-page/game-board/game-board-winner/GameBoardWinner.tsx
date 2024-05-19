import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import { EndGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardWinner.module.scss";

type GameBoardWinnerProps = {
  winner: EndGameDto | null;
};

function GameBoardWinner({ winner }: GameBoardWinnerProps) {
  if (!winner) {
    return;
  }

  return (
    <div className={classes.winner}>
      <div className={classes.winner__content}>
        <h2
          className={`
            ${classes.title}
            ${winner.winnerColor === null ? classes["draw"] : ""}
            ${winner.winnerColor === pieceColor.white ? classes["white-winner"] : ""}
            ${winner.winnerColor === pieceColor.black ? classes["black-winner"] : ""}
          `}
        >
          {winner.winnerColor === null && <span>Draw</span>}
          {winner.winnerColor === pieceColor.white && <span>White Wins</span>}
          {winner.winnerColor === pieceColor.black && <span>Black Wins</span>}
        </h2>
        <div className={classes.players}>xxxx</div>
      </div>
    </div>
  );
}

export default GameBoardWinner;
