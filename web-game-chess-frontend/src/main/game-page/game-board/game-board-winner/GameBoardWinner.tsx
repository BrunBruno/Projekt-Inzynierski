import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import { pieceColor } from "../../../../shared/utils/enums/entitiesEnums";
import {
  EndGameDto,
  GetGameDto,
} from "../../../../shared/utils/types/gameDtos";
import classes from "./GameBoardWinner.module.scss";

type GameBoardWinnerProps = {
  gameData: GetGameDto;
  winner: EndGameDto | null;
};

function GameBoardWinner({ winner, gameData }: GameBoardWinnerProps) {
  if (!winner) return;

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
        <div className={classes.winner__content__info}>
          <div className={classes.winner__content__info__players}>
            <div className={`${classes.player} ${classes["white-player"]}`}>
              <div className={classes["white-player-img"]}>
                {gameData.whitePlayer.imageUrl ? (
                  <img
                    className={classes["player-img"]}
                    src={gameData.whitePlayer.imageUrl}
                    alt="white-player-avatar"
                  />
                ) : (
                  <AvatarSvg iconClass={classes.avatar} />
                )}
              </div>
              <div className={classes["player-data"]}>
                <span>{gameData.whitePlayer.name}</span>
                <span>
                  (<span>{gameData.whitePlayer.elo}</span>)
                </span>
              </div>
            </div>
            <p>vs</p>
            <div className={`${classes.player} ${classes["black-player"]}`}>
              <div className={classes["black-player-img"]}>
                {gameData.blackPlayer.imageUrl ? (
                  <img
                    className={classes["player-img"]}
                    src={gameData.blackPlayer.imageUrl}
                    alt="black-player-avatar"
                  />
                ) : (
                  <AvatarSvg iconClass={classes.avatar} />
                )}
              </div>
              <div className={classes["player-data"]}>
                <span>{gameData.blackPlayer.name}</span>
                <span>
                  (<span>{gameData.blackPlayer.elo}</span>)
                </span>
              </div>
            </div>
          </div>

          <div className={classes.winner__content__info__buttons}>
            <button className={classes["new-game"]}>New Game</button>
            <button className={classes["re-game"]}>Remach</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameBoardWinner;
