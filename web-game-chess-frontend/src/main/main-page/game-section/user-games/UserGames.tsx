import axios from "axios";
import classes from "./UserGame.module.scss";
import { GetFinishedGamesDto } from "../../../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { GetFinishedGamesModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useState } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import UserGamesFilters from "./user-games-filters/UserGamesFilters";
import usePagination from "../../../../shared/utils/hooks/usePagination";
import UserGamesCard from "./user-games-card/UserGamesCard";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../../shared/utils/types/abstracDtosAndModels";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  ///

  const [games, setGames] = useState<GetFinishedGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const [timingTypeFilters, setTimingTypeFilters] = useState<number[]>([]);
  const [resultFilters, setResultFilters] = useState<(boolean | null)[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { showPopup } = usePopup();

  const { scrollRef, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  useEffect(() => {
    setDefPageSize(6);
  }, []);

  // get all finished games
  const getGames = async () => {
    const getGamesOptions: GetFinishedGamesModel = {
      pageNumber: 1,
      pageSize: pageSize,
      timingTypeFilters: timingTypeFilters,
      resultFilters: resultFilters,
    };

    try {
      const gamesRespones = await axios.get<PagedResult<GetFinishedGamesDto>>(
        gameControllerPaths.getAllFinishedGames(getGamesOptions),
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
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    getGames();
  }, [pageSize, timingTypeFilters, resultFilters]);

  if (!games) return <LoadingPage text="Loading games" />;

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
      <div ref={scrollRef} className={classes.games__list}>
        {games.map((game, i) => (
          <UserGamesCard key={`game-${i}`} game={game} />
        ))}
      </div>

      {showFilters && (
        <UserGamesFilters
          timingTypeFilters={timingTypeFilters}
          setTimingTypeFilters={setTimingTypeFilters}
          resultFilters={resultFilters}
          setResultFilters={setResultFilters}
        />
      )}
    </div>
  );
}

export default UserGames;
