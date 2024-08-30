import { useEffect, useRef } from "react";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import { EndGameTypes, TimingTypes } from "../../../../../shared/utils/enums/entitiesEnums";
import { pieceImageMap } from "../../../../../shared/utils/enums/piecesMaps";
import { getEnumKeyByEnumValue } from "../../../../../shared/utils/functions/enumRelated";
import { PlayerDto } from "../../../../../shared/utils/types/abstractDtosAndModels";
import { GetAllFinishedGamesDto } from "../../../../../shared/utils/types/gameDtos";
import classes from "./UserGamesCard.module.scss";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { timingTypesIcons } from "../../../../../shared/svgs/TimingTypesIcons";
import { winLoseIcons } from "../../../../../shared/svgs/WinLoseIcons";
import { winTypesIcons } from "../../../../../shared/svgs/WinTypesIcons";
import { mainColor } from "../../../../../shared/utils/enums/colorMaps";

type UserGamesCardProps = {
  // finished game data
  game: GetAllFinishedGamesDto;
};

function UserGamesCard({ game }: UserGamesCardProps) {
  ///

  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  // updates card size on resize
  useEffect(() => {
    const resizeCard = () => {
      const card = cardRef.current;
      const grid = gridRef.current;
      const data = dataRef.current;

      if (card && grid && data) {
        card.style.height = `${card.clientWidth + data.clientHeight}px`;
        grid.style.height = `${grid.clientWidth}px`;
      }
    };

    window.addEventListener("resize", resizeCard);
    resizeCard();

    return () => {
      window.removeEventListener("resize", resizeCard);
    };
  }, []);
  //*/

  // display players based on user player color
  const displayPlayer = (game: GetAllFinishedGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    const renderPlayer = (player: PlayerDto, isWhite: boolean, eloGained: number) => (
      <div className={classes.player}>
        <AvatarImage
          username={player.name}
          imageUrl={player.imageUrl}
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

    if (userInfoObject.username === game.whitePlayer.name) {
      const betterOpp =
        game.whitePlayer.elo === game.blackPlayer.elo ? null : game.whitePlayer.elo < game.blackPlayer.elo;

      const sign =
        game.isWinner === null ? (betterOpp === null ? "" : betterOpp ? "+" : "-") : game.isWinner ? "+" : "-";

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

    if (userInfoObject.username === game.blackPlayer.name) {
      const betterOpp =
        game.whitePlayer.elo === game.blackPlayer.elo ? null : game.blackPlayer.elo < game.whitePlayer.elo;

      const sign =
        game.isWinner === null ? (betterOpp === null ? "" : betterOpp ? "+" : "-") : game.isWinner ? "+" : "-";

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
  //*/

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
          fields.push(<div key={ind} className={`${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}`}></div>);

          ind++;
        }
      } else {
        fields.push(
          <div
            key={ind}
            className={`${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}`}
            style={{ backgroundImage: `url("/pieces/${pieceImageMap[char]}")` }}
          ></div>
        );
        ind++;
      }
    }

    return fields;
  };
  //*/

  return (
    <div ref={cardRef} className={classes.card}>
      <div ref={gridRef} className={`${classes["mini-grid"]}`}>
        {mapFromPosition(game.position)}
        {displayPlayer(game)}
        <div className={classes.date}>{new Date(game.createdAt).toLocaleDateString()}</div>
      </div>

      <div ref={dataRef} className={classes["game-data"]}>
        <div className={classes["timing-type"]}>
          <IconCreator
            icons={timingTypesIcons}
            iconName={getEnumKeyByEnumValue(TimingTypes, game.timingType)}
            iconClass=""
            color={mainColor.c5}
          />
        </div>
        <div className={classes["is-winner"]}>
          {game.isWinner === null ? (
            <IconCreator icons={winLoseIcons} iconName="draw" />
          ) : game.isWinner === true ? (
            <IconCreator icons={winLoseIcons} iconName="win" />
          ) : (
            <IconCreator icons={winLoseIcons} iconName="lose" />
          )}
        </div>

        <div className={classes.moves}>{game.moves}</div>
        <div className={classes["win-type"]}>
          <IconCreator icons={winTypesIcons} iconName={getEnumKeyByEnumValue(EndGameTypes, game.endGameType)} />
        </div>
      </div>
    </div>
  );
}

export default UserGamesCard;
