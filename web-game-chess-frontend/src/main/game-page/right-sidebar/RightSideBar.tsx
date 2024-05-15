import { pieceImageMap } from "../../../shared/utils/enums/piecesMaps";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import classes from "./RightSideBar.module.scss";

type RightSideBarProps = {
  gameData: GetGameDto;
  playerData: GetPlayerDto;
};

function RightSideBar({ gameData, playerData }: RightSideBarProps) {
  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        <div className={classes.bar__content__header}>
          <div
            className={`${classes.bar__content__header__player} ${classes["white-player"]}`}
          >
            <div className={classes["white-player-img"]}>
              <img className={classes["player-img"]} src="/images/avatar.jpg" />
            </div>
            <div className={classes["player-data"]}>
              <span>{gameData.whitePlayer.name}</span>
              <span>({gameData.whitePlayer.elo})</span>
            </div>
          </div>
          <p>vs</p>
          <div
            className={`${classes.bar__content__header__player} ${classes["black-player"]}`}
          >
            <div className={classes["black-player-img"]}>
              <img className={classes["player-img"]} src="/images/avatar.jpg" />
            </div>
            <div className={classes["player-data"]}>
              <span>{gameData.blackPlayer.name}</span>
              <span>({gameData.blackPlayer.elo})</span>
            </div>
          </div>
        </div>
        <div className={classes.bar__content__history}>
          <div className={classes.bar__content__history__list}>
            {gameData.moves.map((move, i) => {
              const turn = Math.floor((move.turn - 1) / 2) + 1;

              return (
                <div
                  key={i}
                  className={classes.bar__content__history__list__record}
                >
                  {i % 2 === 0 ? (
                    <p className={classes.turn}>{turn + ". "}</p>
                  ) : (
                    <p className={classes.sep}>:</p>
                  )}
                  <p className={classes.move}>
                    <img src={`/pieces/${pieceImageMap[move.move[0]]}`} />
                    <span>
                      {move.move.charAt(0).toUpperCase() +
                        move.move.slice(1).toLowerCase()}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className={classes.bar__content__actions}></div>
      </div>
    </section>
  );
}

export default RightSideBar;
