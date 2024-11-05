import { useNavigate } from "react-router-dom";
import classes from "./EngineGameWinner.module.scss";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { Guid } from "guid-typescript";
import { EndEngineGameDto, GetEngineGameDto } from "../../../../shared/utils/types/engineDtos";

type EngineGameWinnerProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  // game result data data
  winner: EndEngineGameDto | null;
};

function EngineGameWinner({ gameData, winner }: EngineGameWinnerProps) {
  ///

  const navigate = useNavigate();

  // generate players schema
  const generatePlayers = (): JSX.Element => {
    if (!winner) return <></>;

    const renderPlayer = (playerDto: PlayerDto | null, colorClass: string, avatarClass: string): JSX.Element => {
      let player = playerDto;
      if (!player) {
        player = {
          name: "Computer",
          profilePicture: null,
          elo: 0,
          color: gameData.player.color === PieceColor.white ? PieceColor.black : PieceColor.white,
        };
      }

      return (
        <div className={`${classes.player} ${colorClass}`}>
          <AvatarImage
            username={player.name}
            profilePicture={player.profilePicture}
            containerClass={avatarClass}
            imageClass={classes["player-img"]}
          />

          <div className={classes["player-data"]}>
            <span>{player.name}</span>
          </div>
        </div>
      );
    };

    return (
      <div className={classes.winner__content__info__players}>
        {renderPlayer(gameData.player, classes["black-player"], classes["black-player-img"])}

        <div className={classes.vs}>
          <span>vs</span>
        </div>

        {renderPlayer(null, classes["black-player"], classes["black-player-img"])}
      </div>
    );
  };
  //*/

  if (!winner) return <></>;

  return (
    <div className={classes.winner}>
      <div className={classes.winner__content}>
        <h2
          className={`
            ${classes.title}
            ${winner.winnerColor === null ? classes["draw"] : ""}
            ${winner.winnerColor === PieceColor.white ? classes["white-winner"] : ""}
            ${winner.winnerColor === PieceColor.black ? classes["black-winner"] : ""}
          `}
        >
          {winner.winnerColor === null && <span>Draw</span>}
          {winner.winnerColor === PieceColor.white && <span>White Wins</span>}
          {winner.winnerColor === PieceColor.black && <span>Black Wins</span>}
        </h2>

        <div className={classes.winner__content__info}>
          {generatePlayers()}

          <div className={classes.winner__content__info__buttons}>
            <button className={classes["new-game"]} onClick={() => {}}>
              <span>New Game</span>
            </button>

            <button
              className={classes["re-game"]}
              onClick={() => {
                navigate("/main");
              }}
            >
              <span>Leave</span>
            </button>
          </div>

          <div className={classes.leave}></div>
        </div>
      </div>
    </div>
  );
}

export default EngineGameWinner;
