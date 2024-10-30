import { useNavigate } from "react-router-dom";
import { EndGameDto, GetEndedGameDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./EngineGameWinner.module.scss";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { Guid } from "guid-typescript";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineDtos";

type EngineGameWinnerProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  // game result data data
  winner: EndGameDto | GetEndedGameDto | null;
};

function EngineGameWinner({ gameData, winner }: EngineGameWinnerProps) {
  ///

  const navigate = useNavigate();

  // generate players schema
  const generatePlayers = (): JSX.Element => {
    if (!winner) return <></>;

    const renderPlayer = (player: PlayerDto, colorClass: string, avatarClass: string): JSX.Element => {
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
            <span>
              (<span>{player.elo + winner.eloGain}</span>)
            </span>
          </div>
        </div>
      );
    };

    const wasOpponentBetter =
      gameData.whitePlayer.elo === gameData.blackPlayer.elo
        ? null
        : gameData.whitePlayer.elo < gameData.blackPlayer.elo;

    const isWinner = winner.winnerColor !== null ? (playerData.color === winner.winnerColor ? true : false) : null;

    const sign =
      isWinner === null ? (wasOpponentBetter === null ? "" : wasOpponentBetter ? "+" : "-") : isWinner ? "+" : "-";

    const eloGained = Math.abs(winner.eloGain);

    return (
      <div className={classes.winner__content__info__players}>
        {gameData.whitePlayer.name == playerData.name
          ? renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])
          : renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])}

        <div className={classes.vs}>
          <span>vs</span>

          <span>
            <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
            {eloGained}
          </span>
        </div>

        {gameData.whitePlayer.name == playerData.name
          ? renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])
          : renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])}
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
            <button
              className={classes["new-game"]}
              onClick={() => {
                onSearchForGame();
              }}
            >
              <span>New Game</span>
            </button>

            {newGameId ? (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onAcceptRematchRequest();
                }}
              >
                <span>Accept</span>
              </button>
            ) : (
              <button
                className={classes["re-game"]}
                onClick={() => {
                  onCreateRematchRequest();
                }}
              >
                <span>Rematch</span>
              </button>
            )}
          </div>

          <div className={classes.leave}>
            <button
              onClick={() => {
                navigate("/main");
              }}
            >
              <span>Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngineGameWinner;
