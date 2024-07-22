import AvatarSvg from "../../../../../shared/svgs/AvatarSvg";
import TimingTypesIcons from "../../../../../shared/svgs/TimingTypesIcons";
import WinLoseIcons from "../../../../../shared/svgs/WinLoseIcons";
import WinTypesIcons from "../../../../../shared/svgs/WinTypesIcons";
import {
  endGameTypes,
  timingTypes,
} from "../../../../../shared/utils/enums/entitiesEnums";
import { pieceImageMap } from "../../../../../shared/utils/enums/piecesMaps";
import { getEnumTypeByNumber } from "../../../../../shared/utils/functions/enumRelated";
import {
  GetFinishedGamesDto,
  GetFinishedGamesPlayerDto,
} from "../../../../../shared/utils/types/gameDtos";
import classes from "./UserGamesCard.module.scss";

type UserGamesCardProps = {
  game: GetFinishedGamesDto;
};

function UserGamesCard({ game }: UserGamesCardProps) {
  // display players based on user player color
  const displayPlayer = (game: GetFinishedGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    const renderPlayer = (
      player: GetFinishedGamesPlayerDto,
      isWhite: boolean,
      eloGained: number
    ) => (
      <div className={classes.player}>
        <div
          className={
            isWhite ? classes["white-player-img"] : classes["black-player-img"]
          }
        >
          {player.imageUrl !== null ? (
            <img
              className={classes["player-img"]}
              src={player.imageUrl}
              alt={`${isWhite ? "white" : "black"}-player-avatar`}
            />
          ) : (
            <AvatarSvg iconClass={classes.avatar} />
          )}
        </div>
        <div className={classes["player-data"]}>
          <span>{player.name}</span>
          <span>
            (<span>{player.elo + eloGained}</span>)
          </span>
        </div>
      </div>
    );

    if (userInfoObject.userName === game.whitePlayer.name) {
      const betterOpp =
        game.whitePlayer.elo === game.blackPlayer.elo
          ? null
          : game.whitePlayer.elo < game.blackPlayer.elo;

      const sign =
        game.isWinner === null
          ? betterOpp === null
            ? ""
            : betterOpp
            ? "+"
            : "-"
          : game.isWinner
          ? "+"
          : "-";

      const eloGained = parseInt(sign + game.eloGained);

      return (
        <div className={classes.players}>
          {renderPlayer(game.whitePlayer, true, eloGained)}
          <div className={classes.players__sep}>
            <span>vs</span>

            <span>
              <span className={sign === "+" ? classes.p : classes.m}>
                {sign}
              </span>
              {game.eloGained}
            </span>
          </div>
          {renderPlayer(game.blackPlayer, false, -eloGained)}
        </div>
      );
    }

    if (userInfoObject.userName === game.blackPlayer.name) {
      const betterOpp =
        game.whitePlayer.elo === game.blackPlayer.elo
          ? null
          : game.blackPlayer.elo < game.whitePlayer.elo;

      const sign =
        game.isWinner === null
          ? betterOpp === null
            ? ""
            : betterOpp
            ? "+"
            : "-"
          : game.isWinner
          ? "+"
          : "-";

      const eloGained = parseInt(sign + game.eloGained);

      return (
        <div className={classes.players}>
          {renderPlayer(game.blackPlayer, false, eloGained)}
          <div className={classes.players__sep}>
            <span>vs</span>

            <span>
              <span className={sign === "+" ? classes.p : classes.m}>
                {sign}
              </span>
              {game.eloGained}
            </span>
          </div>
          {renderPlayer(game.whitePlayer, true, -eloGained)}
        </div>
      );
    }

    return <></>;
  };

  console.log(game);

  // create board from game position
  const mapFromPosition = (position: string): JSX.Element[] => {
    const fields: JSX.Element[] = [];
    let ind: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      if (char == "/") {
        ind++;
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fields.push(
            <div
              key={ind}
              className={`${
                ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]
              }`}
            ></div>
          );

          ind++;
        }
      } else {
        fields.push(
          <div
            key={ind}
            className={`${
              ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]
            }`}
            style={{ backgroundImage: `url("/pieces/${pieceImageMap[char]}")` }}
          ></div>
        );
        ind++;
      }
    }

    return fields;
  };

  return (
    <div className={classes.card}>
      <div className={`${classes["mini-grid"]}`}>
        {mapFromPosition(game.position)}
        {displayPlayer(game)}
        <div className={classes.date}>
          {new Date(game.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className={classes["game-data"]}>
        <div className={classes["timing-type"]}>
          <TimingTypesIcons
            iconName={getEnumTypeByNumber(timingTypes, game.timingType)}
            iconClass=""
          />
        </div>
        <div className={classes["is-winner"]}>
          {game.isWinner === null ? (
            <WinLoseIcons iconName="draw" />
          ) : game.isWinner === true ? (
            <WinLoseIcons iconName="win" />
          ) : (
            <WinLoseIcons iconName="lose" />
          )}
        </div>

        <div className={classes.moves}>{game.moves}</div>
        <div className={classes["win-type"]}>
          <WinTypesIcons
            iconName={getEnumTypeByNumber(endGameTypes, game.endGameType)}
          />
        </div>
      </div>
    </div>
  );
}

export default UserGamesCard;
