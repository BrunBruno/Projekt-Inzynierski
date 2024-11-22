import { useEffect, useRef } from "react";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import classes from "./UserGamesCard.module.scss";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { gameResultIcons } from "../../../../shared/svgs/iconsMap/GameResultIcons";
import { getPieceSideColor } from "../../../../shared/utils/objects/piecesNameMaps";
import { useNavigate } from "react-router-dom";
import { GetAllEngineGamesDto } from "../../../../shared/utils/types/engineGameDtos";

type EngineGamesCardProps = {
  // finished game data
  game: GetAllEngineGamesDto;
};

function EngineGamesCard({ game }: EngineGamesCardProps) {
  ///

  const navigate = useNavigate();

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

  // to rejoin the game
  const onRejoinGame = (): void => {
    if (!game.gameId) return;

    navigate(`/main/engine-game/${game.gameId}`);
  };

  // display players based on user player color
  const displayPlayer = (game: GetAllEngineGamesDto): JSX.Element => {
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
            (
            <span>
              {isNaN(player.elo) || isNaN(eloGained)
                ? "-"
                : player.name === "BOT"
                ? `lvl ${player.elo}`
                : player.elo + eloGained}
            </span>
            )
          </span>
        </div>
      </div>
    );

    // white player case
    if (userInfoObject.username === game.whitePlayer.name) {
      const sign = game.isWinner === null ? "" : game.isWinner ? "+" : "-";

      return (
        <div className={classes.players}>
          {renderPlayer(game.whitePlayer, true, game.eloGained)}

          <div className={classes.players__sep}>
            <span>vs</span>

            <span>
              <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
              {Math.abs(game.eloGained)}
            </span>
          </div>

          {renderPlayer(game.blackPlayer, false, -game.eloGained)}
        </div>
      );
    }

    // black player case
    if (userInfoObject.username === game.blackPlayer.name) {
      const sign = game.isWinner === null ? "" : game.isWinner ? "+" : "-";

      return (
        <div className={classes.players}>
          {renderPlayer(game.blackPlayer, false, game.eloGained)}

          <div className={classes.players__sep}>
            <span>vs</span>

            <span>
              <span className={sign === "+" ? classes.p : classes.m}>{sign}</span>
              {Math.abs(game.eloGained)}
            </span>
          </div>

          {renderPlayer(game.whitePlayer, true, -game.eloGained)}
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
    <div
      ref={cardRef}
      className={classes.card}
      onClick={() => {
        onRejoinGame();
      }}
    >
      <div ref={gridRef} className={`${classes["mini-grid"]}`}>
        {mapFromPosition(game.position)}
        {displayPlayer(game)}
        <div className={classes.date}>{new Date(game.createdAt).toLocaleDateString()}</div>
      </div>

      <div ref={dataRef} className={classes["game-data"]}>
        {/*
        <div className={classes["timing-type"]}>
          <IconCreator
            icons={timingTypeIcons}
            iconName={getEnumKeyByEnumValue(TimingType, game.timingType) as TimingTypeName}
            color={mainColor.c5}
          />
        </div> */}

        {/* game result */}
        <div className={classes["is-winner"]}>
          {game.isWinner === null ? (
            <IconCreator icons={gameResultIcons} iconName={"draw"} />
          ) : game.isWinner === true ? (
            <IconCreator icons={gameResultIcons} iconName={"win"} />
          ) : (
            <IconCreator icons={gameResultIcons} iconName={"lose"} />
          )}
        </div>

        {/* moves */}
        <div className={classes.moves}>{game.moves}</div>

        {/* <div className={classes["win-type"]}>
          <IconCreator
            icons={gameEndReasonIcons}
            iconName={getEnumKeyByEnumValue(GameEndReason, game.endGameType) as GameEndReasonName}
          />
        </div> */}
      </div>
    </div>
  );
}

export default EngineGamesCard;
