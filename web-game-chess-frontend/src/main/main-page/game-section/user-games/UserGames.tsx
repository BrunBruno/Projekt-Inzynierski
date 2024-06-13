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
import { getEnumTypeByNumber } from "../../../../shared/utils/functions/enumRelated";
import {
  endGameTypes,
  timingTypes,
} from "../../../../shared/utils/enums/entitiesEnums";
import WinTypesIocns from "./user-game-icons/WinTypesIcons";
import { PagedResult } from "../../../../shared/utils/types/commonTypes";
import UserGamesFilters from "./user-games-filters/UserGamesFilters";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const [games, setGames] = useState<GetFinishedGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  const [pageSize, setPageSize] = useState<number>(6);
  const [timingTypeFilters, setTimingTypeFilters] = useState<number[]>([
    0,
    1,
    2,
    3,
  ]);

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // get all finished games
  const getGames = async () => {
    const getGamesOptions: GetFinishedGamesModel = {
      pageNumber: 1,
      pageSize: pageSize,
      timingTypeFilters: [0, 1],
    };

    try {
      const gamesRespones = await axios.get<PagedResult<GetFinishedGamesDto>>(
        gameControllerPaths.getFinishedGames(getGamesOptions),
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
  }, [pageSize, timingTypeFilters]);

  // icrease page size on scroll
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

  // display players based on user player color
  const displayPlayer = (game: GetFinishedGamesDto): JSX.Element => {
    const userInfo = localStorage.getItem("userInfo");

    if (!userInfo) return <></>;

    const userInfoObject = JSON.parse(userInfo);

    const renderPlayer = (player: any, isWhite: boolean, eloGained: number) => (
      <div className={classes.player}>
        <div
          className={
            isWhite ? classes["white-player-img"] : classes["black-player-img"]
          }
        >
          {player.imageUrl ? (
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
        <div className={classes.filters}>
          <button
            onClick={() => {
              setShowFilters((prev) => !prev);
            }}
          >
            Filters
          </button>
        </div>
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
                  iconName={getEnumTypeByNumber(timingTypes, game.timingType)}
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
                  iconName={getEnumTypeByNumber(endGameTypes, game.endGameType)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showFilters && (
        <UserGamesFilters setTimingTypeFilters={setTimingTypeFilters} />
      )}
    </div>
  );
}

export default UserGames;
