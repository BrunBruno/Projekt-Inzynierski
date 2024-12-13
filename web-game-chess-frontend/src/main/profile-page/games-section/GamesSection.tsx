import { GetAllFinishedGamesDto } from "../../../shared/utils/types/webGameDtos";
import classes from "./GamesSection.module.scss";
import { PagedResult, PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetGamesOfFriendshipDto } from "../../../shared/utils/types/friendshipDtos";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { PieceTag } from "../../../shared/utils/objects/constantLists";
import { defaultPiecesImages } from "../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { getPieceSideColor } from "../../../shared/utils/objects/piecesNameMaps";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";

type GamesSectionProps = {
  // paged result of type history dtos
  games: PagedResult<GetAllFinishedGamesDto> | null;
};

function GamesSection({ games }: GamesSectionProps) {
  ///

  // create board from game position
  const mapFromPosition = (position: string): JSX.Element[] => {
    const fields: JSX.Element[] = [];
    let ind: number = 0;

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      if (char === "/") {
        ind++;
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fields.push(
            <div
              key={ind}
              className={`
                ${classes.field} 
                ${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}
              `}
            ></div>
          );

          ind++;
        }
      } else {
        fields.push(
          <div
            key={ind}
            className={`
              ${classes.field}
              ${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}
            `}
          >
            <IconCreator
              icons={defaultPiecesImages}
              iconName={char.toLowerCase() as PieceTag}
              color={getPieceSideColor(char as PieceTag)}
              iconClass={classes["bg-piece"]}
            />
          </div>
        );
        ind++;
      }
    }

    return fields;
  };

  // display players based on user player color
  const displayPlayers = (game: GetAllFinishedGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    // generate player avatar element
    const renderPlayer = (player: PlayerDto, isWhite: boolean, eloGained: number) => (
      <div className={classes.player}>
        <AvatarImage
          username={player.name}
          profilePicture={player.profilePicture}
          containerClass={isWhite ? classes["white-player-img"] : classes["black-player-img"]}
          imageClass={classes["player-img"]}
        />

        <div className={classes["player-data"]}>
          <span>{player.name}</span>
          <span>
            (<span>{player.elo + eloGained}</span>)
          </span>
        </div>
      </div>
    );

    // white player case
    if (userInfoObject.username === game.whitePlayer.name) {
      const wasOpponentBetter =
        game.whitePlayer.elo === game.blackPlayer.elo ? null : game.whitePlayer.elo < game.blackPlayer.elo;

      const sign =
        game.isWinner === null
          ? wasOpponentBetter === null
            ? ""
            : wasOpponentBetter
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
              <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
              {game.eloGained}
            </span>
          </div>

          {renderPlayer(game.blackPlayer, false, -eloGained)}
        </div>
      );
    }

    // black player case
    if (userInfoObject.username === game.blackPlayer.name) {
      const wasOpponentBetter =
        game.whitePlayer.elo === game.blackPlayer.elo ? null : game.blackPlayer.elo < game.whitePlayer.elo;

      const sign =
        game.isWinner === null
          ? wasOpponentBetter === null
            ? ""
            : wasOpponentBetter
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
              <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
              {game.eloGained}
            </span>
          </div>

          {renderPlayer(game.whitePlayer, true, -eloGained)}
        </div>
      );
    }

    return <></>;
  };

  if (!games) return <LoadingPage text="Loading games..." />;

  return (
    <div className={classes.games}>
      <h2 className={classes["games-title"]}>
        <span>Games played together</span>
      </h2>

      <div className={classes.games__items}>
        {games.items.map((game: GetGamesOfFriendshipDto, i: number) => (
          <div key={`game-${i}`} className={classes["game-card"]}>
            <div className={`${classes["mini-grid"]}`}>
              {mapFromPosition(game.position)}
              {displayPlayers(game)}

              <div className={classes.date}>{new Date(game.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesSection;
