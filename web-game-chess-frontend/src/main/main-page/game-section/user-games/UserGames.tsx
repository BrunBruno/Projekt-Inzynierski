import axios from "axios";
import classes from "./UserGame.module.scss";
import { GetAllFinishedGamesDto } from "../../../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { GetAllFinishedGamesModel } from "../../../../shared/utils/types/gameModels";
import { useEffect, useState } from "react";
import LoadingPage from "../../../../shared/components/loading-page/LoadingPage";
import UserGamesFilters from "./user-games-filters/UserGamesFilters";
import usePagination from "../../../../shared/utils/hooks/usePagination";
import UserGamesCard from "./user-games-card/UserGamesCard";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { PagedResult } from "../../../../shared/utils/types/abstractDtosAndModels";

type UserGamesProps = {};

function UserGames({}: UserGamesProps) {
  ///

  const [games, setGames] = useState<GetAllFinishedGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);

  const [timingTypeFilters, setTimingTypeFilters] = useState<number[]>([]);
  const [resultFilters, setResultFilters] = useState<(boolean | null)[]>([]);

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { showPopup } = usePopup();

  const { scrollRef, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  // send set default pagination page size
  useEffect(() => {
    const setDefSize = () => {
      let elemCount: number;
      if (window.innerWidth > 700) {
        elemCount = 3;
      } else {
        elemCount = 2;
      }

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
    const getGames = async () => {
      const getGamesOptions: GetAllFinishedGamesModel = {
        pageNumber: 1,
        pageSize: pageSize,
        timingTypeFilters: timingTypeFilters,
        resultFilters: resultFilters,
      };

      try {
        const response = await axios.get<PagedResult<GetAllFinishedGamesDto>>(
          gameControllerPaths.getAllFinishedGames(getGamesOptions),
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
  }, [pageSize, timingTypeFilters, resultFilters]);
  //*/

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
