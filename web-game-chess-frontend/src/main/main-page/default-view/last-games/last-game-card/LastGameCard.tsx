import { useEffect, useRef } from "react";
import classes from "./LastGameCard.module.scss";
import { GetAllFinishedGamesDto } from "../../../../../shared/utils/types/webGameDtos";
import { PlayerDto } from "../../../../../shared/utils/types/abstractDtosAndModels";
import AvatarImage from "../../../../../shared/components/avatar-image/AvatarImage";
import IconCreator from "../../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { getPieceSideColor } from "../../../../../shared/utils/objects/piecesNameMaps";
import { PieceTag } from "../../../../../shared/utils/objects/constantLists";

type LastGameCardProps = {
  // finished game data
  game: GetAllFinishedGamesDto;
};

function LastGameCard({ game }: LastGameCardProps) {
  ///

  // elements ref for card resizing
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  // updates card size on resize
  useEffect(() => {
    const resizeCard = (): void => {
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

  return (
    <div ref={cardRef} className={classes.card}>
      <div ref={gridRef} className={`${classes["mini-grid"]}`}>
        {/* bg board */}
        {mapFromPosition(game.position)}

        {/* players */}
        {displayPlayers(game)}

        {/* played at */}
        <div className={classes.date}>{new Date(game.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
}

export default LastGameCard;
