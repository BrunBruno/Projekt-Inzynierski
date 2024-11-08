import classes from "./GameRightSidebar.module.scss";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetEngineGameDto } from "../../../shared/utils/types/engineDtos";
import { PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import EngineGameMoveRecord from "./game-move-record/EngineGameMoveRecord";
import EngineGameMessages from "./game-messages/EngineGameMessages";
import { Guid } from "guid-typescript";

type EngineGameRightSidebarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetEngineGameDto;
};

function EngineGameRightSidebar({ gameId, gameData }: EngineGameRightSidebarProps) {
  ///

  const renderPlayer = (playerDto: PlayerDto | null, colorClass: string, avatarClass: string): JSX.Element => {
    let isBot: boolean = false;
    let player: PlayerDto | null = playerDto;
    if (!player) {
      player = {
        name: "Computer",
        profilePicture: null,
        elo: 0,
        color: gameData.player.color === PieceColor.white ? PieceColor.black : PieceColor.white,
      };

      isBot = true;
    }

    return (
      <div className={`${classes.bar__content__header__player} ${colorClass}`}>
        <AvatarImage
          username={player.name}
          profilePicture={player.profilePicture}
          containerClass={avatarClass}
          imageClass={classes["player-img"]}
          isBot={isBot}
        />

        <div className={classes["player-data"]}>
          <span className={classes["name"]}>{player.name}</span>
          <span className={classes["elo"]}>
            (<span>{player.name === "Computer" ? `lvl ${gameData.engineLevel}` : player.elo}</span>)
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/* players data */}
        <div className={classes.bar__content__header}>
          {gameData.player.color === PieceColor.white
            ? renderPlayer(gameData.player, classes["white-player"], classes["white-player-img"])
            : renderPlayer(gameData.player, classes["black-player"], classes["black-player-img"])}

          <p className={classes.vs}>
            <span>vs</span>
          </p>

          {gameData.player.color === PieceColor.black
            ? renderPlayer(null, classes["white-player"], classes["white-player-img"])
            : renderPlayer(null, classes["black-player"], classes["black-player-img"])}
        </div>
        {/* --- */}

        {/* game clock */}
        {null === null ? (
          <div className={classes["fetching"]}>Fetching time...</div>
        ) : (
          // <EngineGameClock
          //   gameData={gameData}
          //   whitePlayerSeconds={playersTimes.whiteTimeLeft}
          //   blackPlayerSeconds={playersTimes.blackTimeLeft}
          // />
          <></>
        )}
        {/* --- */}

        {/* game history records */}
        <div className={classes.bar__content__block}>
          <div className={classes.bar__content__block__list}>
            {gameData.moves.length > 0
              ? gameData.moves.map((move, i) => <EngineGameMoveRecord key={i} recordNum={i} move={move} />)
              : Array.from({ length: 10 }).map((_, i) => <EngineGameMoveRecord key={i} recordNum={i} move={null} />)}
          </div>
        </div>
        {/* --- */}

        {/*  */}
        <div className={classes.bar__content__block}>
          <EngineGameMessages gameId={gameId} />
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default EngineGameRightSidebar;