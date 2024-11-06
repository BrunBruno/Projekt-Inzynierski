import { useNavigate } from "react-router-dom";
import { GetAllActiveGamesDto } from "../../../../shared/utils/types/gameDtos";
import classes from "./ActiveGamesCard.module.scss";
import { useEffect, useRef } from "react";
import AvatarImage from "../../../../shared/components/avatar-image/AvatarImage";
import { PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { getPieceSideColor } from "../../../../shared/utils/objects/piecesNameMaps";
import { PieceTag, TimingTypeName } from "../../../../shared/utils/objects/constantLists";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { defaultPiecesImages } from "../../../../shared/svgs/iconsMap/DefaultPieceImageSvgs";
import { StateOptions } from "../../../../shared/utils/objects/interfacesEnums";
import { getEnumKeyByEnumValue } from "../../../../shared/utils/functions/enums";
import { TimingType } from "../../../../shared/utils/objects/entitiesEnums";
import { timingTypeIcons } from "../../../../shared/svgs/iconsMap/TimingTypeIcons";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { makeTimeFromMinutes } from "../../../../shared/utils/functions/datetime";

type ActiveGamesCardProps = {
  // finished game data
  game: GetAllActiveGamesDto;
};

function ActiveGamesCard({ game }: ActiveGamesCardProps) {
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
  //*/

  // display players based on user player color
  const displayPlayer = (game: GetAllActiveGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    // generate player avatar element
    const renderPlayer = (player: PlayerDto, isWhite: boolean) => (
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
            (<span>{player.elo}</span>)
          </span>
        </div>
      </div>
    );

    // white player case
    if (userInfoObject.username === game.whitePlayer.name) {
      return (
        <div className={classes.players}>
          {renderPlayer(game.whitePlayer, true)}

          <div className={classes.players__sep}>
            <span>vs</span>
          </div>

          {renderPlayer(game.blackPlayer, false)}
        </div>
      );
    }

    // black player case
    if (userInfoObject.username === game.blackPlayer.name) {
      return (
        <div className={classes.players}>
          {renderPlayer(game.blackPlayer, false)}

          <div className={classes.players__sep}>
            <span>vs</span>
          </div>

          {renderPlayer(game.whitePlayer, true)}
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
  //*/

  // to rejoin the game
  const onRejoinGame = (): void => {
    if (!game.gameId) return;

    const state: StateOptions = {
      popup: { text: "REJOINED", type: "info" },
    };

    navigate(`/main/game/${game.gameId}`, { state: state });
  };
  //*/

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
        {/* game timing type */}
        <div className={classes["timing-type"]}>
          <IconCreator
            icons={timingTypeIcons}
            iconName={getEnumKeyByEnumValue(TimingType, game.timingType) as TimingTypeName}
            color={mainColor.c5}
          />
        </div>

        {/* moves */}
        <div className={classes.moves}>{game.moves}</div>

        {/* moves */}
        <div className={classes.duration}>{makeTimeFromMinutes(game.timeLeft / 60)}</div>
      </div>
    </div>
  );
}

export default ActiveGamesCard;
