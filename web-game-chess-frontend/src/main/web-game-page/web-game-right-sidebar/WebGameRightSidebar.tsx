import { Dispatch, SetStateAction, useEffect } from "react";
import {
  EndGameDto,
  FetchTimeDto,
  GetEndedGameDto,
  GetGameDto,
  GetPlayerDto,
} from "../../../shared/utils/types/gameDtos";
import classes from "./WebGameRightSidebar.module.scss";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import AvatarImage from "../../../shared/components/avatar-image/AvatarImage";
import { Guid } from "guid-typescript";
import { PlayerDto } from "../../../shared/utils/types/abstractDtosAndModels";
import WebGameMessages from "./web-game-messages/WebGameMessages";
import WebGameMoveRecord from "./web-game-move-record/WebGameMoveRecord";
import WebGameClock from "./web-game-clock/WebGameClock";

type WebGameRightSidebarProps = {
  // game id
  gameId: Guid;
  // game data
  gameData: GetGameDto;
  // player data
  playerData: GetPlayerDto;
  // times left for players
  playersTimes: FetchTimeDto | null;
  // time left setter
  setPlayersTimes: Dispatch<SetStateAction<FetchTimeDto | null>>;
  // winner dto of the game
  winner: EndGameDto | GetEndedGameDto | null;
};

function WebGameRightSidebar({
  gameId,
  gameData,
  playerData,
  playersTimes,
  setPlayersTimes,
  winner,
}: WebGameRightSidebarProps) {
  ///

  // sets time left for both players
  useEffect(() => {
    if (playersTimes === null || gameData.hasEnded || winner !== null) return;

    const whiteTick = (): void => {
      setPlayersTimes((prevTimes) => {
        if (!prevTimes) return null;
        return {
          ...prevTimes,
          whiteTimeLeft: prevTimes.whiteTimeLeft > 0 ? prevTimes.whiteTimeLeft - 1 : 0,
        };
      });
    };

    const blackTick = (): void => {
      setPlayersTimes((prevTimes) => {
        if (!prevTimes) return null;
        return {
          ...prevTimes,
          blackTimeLeft: prevTimes.blackTimeLeft > 0 ? prevTimes.blackTimeLeft - 1 : 0,
        };
      });
    };

    let interval: NodeJS.Timeout;
    if (gameData.turn % 2 === 0) {
      interval = setInterval(whiteTick, 1000);
    } else {
      interval = setInterval(blackTick, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameData, playersTimes, winner]);
  //*/

  // to finish game by time outage
  const endGame = async (loserColor: number | null, endGameType: number): Promise<void> => {
    const loserPlayer: EndGameModel = {
      gameId: gameId,
      loserColor: loserColor,
      endGameType: endGameType,
    };

    await GameHubService.EndGame(loserPlayer);
  };

  useEffect(() => {
    if (playersTimes !== null && playersTimes.whiteTimeLeft <= 0) {
      endGame(PieceColor.white, GameEndReason.outOfTime);
    }
    if (playersTimes !== null && playersTimes.blackTimeLeft <= 0) {
      endGame(PieceColor.black, GameEndReason.outOfTime);
    }
  }, [playersTimes]);
  //*/

  const renderPlayer = (player: PlayerDto, colorClass: string, avatarClass: string): JSX.Element => {
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
          {gameData.whitePlayer.name == playerData.name
            ? renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])
            : renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])}

          <p className={classes.vs}>vs</p>

          {gameData.whitePlayer.name == playerData.name
            ? renderPlayer(gameData.blackPlayer, classes["black-player"], classes["black-player-img"])
            : renderPlayer(gameData.whitePlayer, classes["white-player"], classes["white-player-img"])}
        </div>
        {/* --- */}

        {/* game clock */}
        {playersTimes === null ? (
          <div className={classes["fetching"]}>Fetching time...</div>
        ) : (
          <WebGameClock
            gameData={gameData}
            playerData={playerData}
            whitePlayerSeconds={playersTimes.whiteTimeLeft}
            blackPlayerSeconds={playersTimes.blackTimeLeft}
          />
        )}
        {/* --- */}

        {/* game history records */}
        <div className={classes.bar__content__block}>
          <div className={classes.bar__content__block__list}>
            {gameData.moves.length > 0
              ? gameData.moves.map((move, i) => <WebGameMoveRecord key={i} recordNum={i} move={move} />)
              : Array.from({ length: 10 }).map((_, i) => <WebGameMoveRecord key={i} recordNum={i} move={null} />)}
          </div>
        </div>
        {/* --- */}

        {/* game messenger */}
        <div className={classes.bar__content__block}>
          <WebGameMessages gameId={gameId} playerData={playerData} />
        </div>
        {/* --- */}
      </div>
    </section>
  );
}

export default WebGameRightSidebar;
