import axios from "axios";
import classes from "./UserGame.module.scss";
import { GetFinishedGamesDto } from "../../../../shared/utils/types/gameDtos";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../../shared/utils/functions/apiFunctions";
import { GetFinishedGamesModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useRef, useState } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import { pieceImageMap } from "../../../../shared/utils/enums/piecesMaps";
import AvatarSvg from "../../../../shared/svgs/AvatarSvg";
import UserGamesIcons from "./user-game-icons/UserGamesIcons";
import TimingTypesIcons from "../../../../shared/svgs/TimingTypesIcons";
import { getTimingTypeByNumber } from "../../../../shared/utils/functions/enumRelated";
import {
  endGameTypes,
  timingTypes,
} from "../../../../shared/utils/enums/entitiesEnums";
import WinTypesIocns from "./user-game-icons/WinTypesIcons";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const [games, setGames] = useState<GetFinishedGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  const [pageSize, setPageSize] = useState<number>(6);

  const getGames = async () => {
    const getGamesOptions: GetFinishedGamesModel = {
      pageNumber: 1,
      pageSize: pageSize,
    };

    try {
      const gamesRespones = await axios.get(
        gameControllerPaths.getFinishedGame(getGamesOptions),
        getAuthorization()
      );

      setGames(gamesRespones.data.items);

      setTotalItemsCount(gamesRespones.data.totalItemsCount);
      const count =
        gamesRespones.data.itemsTo < gamesRespones.data.totalItemsCount
          ? gamesRespones.data.itemsTo
          : gamesRespones.data.totalItemsCount;
      setItemsCount(count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGames();
  }, [pageSize]);

  const handleListOnScroll = () => {
    const listElement = listRef.current;
    if (listElement) {
      if (
        listElement.scrollHeight - 1.1 * listElement.scrollTop <=
        listElement.clientHeight
      ) {
        if (pageSize < totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + 6);
        }
      }
    }
  };

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
              className={`${ind % 2 === 0 ? classes["light-f"] : classes["dark-f"]}`}
            ></div>
          );

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

  const displayPlayer = (game: GetFinishedGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    if (userInfoObject.userName === game.whitePlayer.name) {
      return (
        <div className={classes.players}>
          <div className={classes.player}>
            <div className={classes["white-player-img"]}>
              {game.whitePlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={game.whitePlayer.imageUrl}
                  alt="white-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{game.whitePlayer.name}</span>
              <span>
                (<span>{game.whitePlayer.elo}</span>)
              </span>
            </div>
          </div>
          <p>vs</p>
          <div className={classes.player}>
            <div className={classes["black-player-img"]}>
              {game.blackPlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={game.blackPlayer.imageUrl}
                  alt="black-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{game.blackPlayer.name}</span>
              <span>
                (<span>{game.blackPlayer.elo}</span>)
              </span>
            </div>
          </div>
        </div>
      );
    }
    if (userInfoObject.userName === game.blackPlayer.name) {
      return (
        <div className={classes.players}>
          <div className={classes.player}>
            <div className={classes["black-player-img"]}>
              {game.blackPlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={game.blackPlayer.imageUrl}
                  alt="black-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{game.blackPlayer.name}</span>
              <span>
                (<span>{game.blackPlayer.elo}</span>)
              </span>
            </div>
          </div>
          <p>vs</p>
          <div className={classes.player}>
            <div className={classes["white-player-img"]}>
              {game.whitePlayer.imageUrl ? (
                <img
                  className={classes["player-img"]}
                  src={game.whitePlayer.imageUrl}
                  alt="white-player-avatar"
                />
              ) : (
                <AvatarSvg iconClass={classes.avatar} />
              )}
            </div>
            <div className={classes["player-data"]}>
              <span>{game.whitePlayer.name}</span>
              <span>
                (<span>{game.whitePlayer.elo}</span>)
              </span>
            </div>
          </div>
        </div>
      );
    }

    return <></>;
  };

  if (!games) return <LoadingPage />;

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <h2>
          <span>Your previous games: </span>
          <span>
            ({itemsCount}/{totalItemsCount})
          </span>
        </h2>
      </div>
      <div
        ref={listRef}
        className={classes.games__list}
        onWheel={() => {
          handleListOnScroll();
        }}
      >
        {games.map((game, i) => (
          <div key={`game-${i}`} className={classes.games__list__record}>
            <div className={`${classes["mini-grid"]}`}>
              {mapFromPosition(game.position)}
              {displayPlayer(game)}
              <div className={classes.date}>
                {new Date(game.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div key={`game-${i}`} className={classes["game-data"]}>
              <div className={classes["timing-type"]}>
                <TimingTypesIcons
                  iconName={getTimingTypeByNumber(timingTypes, game.timingType)}
                  iconClass=""
                />
              </div>
              <div className={classes["is-winner"]}>
                {game.isWinner === null ? (
                  <UserGamesIcons iconName="draw" />
                ) : game.isWinner === true ? (
                  <UserGamesIcons iconName="win" />
                ) : (
                  <UserGamesIcons iconName="lose" />
                )}
              </div>

              <div className={classes.moves}>{game.moves}</div>
              <div className={classes["win-type"]}>
                <WinTypesIocns
                  iconName={getTimingTypeByNumber(
                    endGameTypes,
                    game.endGameType
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserGames;
