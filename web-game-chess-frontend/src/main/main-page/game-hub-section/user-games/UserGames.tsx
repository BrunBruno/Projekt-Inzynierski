import axios from "axios";
import classes from "./UserGame.module.scss";
import { GetAllFinishedGamesDto } from "../../../../shared/utils/types/gameDtos";
import { gameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { GetAllFinishedGamesModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useState } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import UserGamesFilters from "./user-games-filters/UserGamesFilters";
import usePagination from "../../../../shared/utils/hooks/usePagination";
import UserGamesCard from "./user-games-card/UserGamesCard";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";
import UserGamesEmptyCard from "./user-games-empty-card/UserGamesEmptyCard";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  ///

  const { showPopup } = usePopup();
  const { scrollRef, pageNumber, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  // obtained game list
  const [games, setGames] = useState<GetAllFinishedGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);

  // to display filters options
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // list for setting up search filters
  const [timingTypeFilters, setTimingTypeFilters] = useState<number[]>([]);
  const [resultFilters, setResultFilters] = useState<(boolean | null)[]>([]);

  // send set default pagination page size
  useEffect(() => {
    const setDefSize = (): void => {
      const elemCount = window.innerWidth > 700 ? 3 : 2;

      const container = scrollRef.current;
      if (container) {
        const containerHeight = container.clientHeight;
        const firstChild = container.firstChild as HTMLElement;
        if (firstChild) {
          const elementHeight = firstChild.clientHeight;

          if (elementHeight > 0) {
            const count = Math.ceil(containerHeight / elementHeight) * elemCount;

            setDefPageSize(count);
          }
        }
      }
    };

    setDefSize();
    window.addEventListener("resize", setDefSize);

    return () => {
      window.removeEventListener("resize", setDefSize);
    };
  }, [games]);
  //*/

  // get all finished games
  useEffect(() => {
    const getGames = async (): Promise<void> => {
      const getGamesOptions: GetAllFinishedGamesModel = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        timingTypeFilters: timingTypeFilters,
        resultFilters: resultFilters,
      };

      try {
        const response = await axios.get<PagedResult<GetAllFinishedGamesDto>>(
          gameController.getAllFinishedGames(getGamesOptions),
          getAuthorization()
        );

        setGames(response.data.items);
        setTotalItemsCount(response.data.totalItemsCount);

        const count =
          response.data.itemsTo < response.data.totalItemsCount ? response.data.itemsTo : response.data.totalItemsCount;

        setItemsCount(count);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    getGames();
  }, [pageSize, timingTypeFilters, resultFilters, pageNumber]);
  //*/

  // to display filters
  const onShowFilters = () => {
    if (games && games.length > 0) {
      setShowFilters((prev) => !prev);
    }
  };
  //*/

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <h2 className={classes["header-title"]}>
          <span>Your previous games: </span>

          <span className={classes["counter"]}>
            <span className={classes["sym"]}>(</span>
            {itemsCount}
            <span className={classes["sym"]}>/</span>
            {totalItemsCount}
            <span className={classes["sym"]}>)</span>
          </span>
        </h2>

        <div className={classes.filters}>
          <button
            className={`
                ${classes["filter-button"]} 
                ${!games || games.length === 0 ? classes["disabled"] : classes["enabled"]}
              `}
            onClick={() => {
              onShowFilters();
            }}
          >
            <span>Filters</span>
          </button>
        </div>
      </div>

      {!games ? (
        <LoadingPage text="Loading games" />
      ) : games.length === 0 ? (
        <div ref={scrollRef} className={`${classes.games__list} ${classes.empty}`}>
          {Array.from({ length: pageSize }).map((_, i: number) => (
            <UserGamesEmptyCard key={i} />
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className={classes.games__list}>
          {games.map((game: GetAllFinishedGamesDto, i: number) => (
            <UserGamesCard key={`game-${i}`} game={game} />
          ))}
        </div>
      )}

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
