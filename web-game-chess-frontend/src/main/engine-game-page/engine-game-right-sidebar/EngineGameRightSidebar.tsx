import classes from "./EngineGameRightSidebar.module.scss";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import { GetEngineGameDto } from "../../../shared/utils/types/engineDtos";
import { PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import EngineGameMoveRecord from "./engine-game-move-record/EngineGameMoveRecord";
import EngineGameMessages from "./engine-game-messages/EngineGameMessages";
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
      <div className={`${classes.bar__content__header__player} ${colorClass}`}>
        <AvatarImage
          username={player.name}
          profilePicture={player.profilePicture}
          containerClass={avatarClass}
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
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        {/* players data */}
        <div className={classes.bar__content__header}>
          {renderPlayer(gameData.player, classes["white-player"], classes["white-player-img"])}

          <p className={classes.vs}>
            <span>vs</span>
          </p>

          {renderPlayer(null, classes["black-player"], classes["black-player-img"])}
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
