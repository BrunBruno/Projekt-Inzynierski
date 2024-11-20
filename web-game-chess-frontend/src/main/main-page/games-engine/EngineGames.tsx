import { useEffect, useState } from "react";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import LoadingPage from "../../../shared/components/loading-page/LoadingPage";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { engineGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { GetAllEngineGamesDto } from "../../../shared/utils/types/engineGameDtos";
import { GetAllEngineGamesModel } from "../../../shared/utils/types/engineGameModels";
import { mainPageIcons } from "../MainPageIcons";
import classes from "./EngineGames.module.scss";
import { PagedResult } from "../../../shared/utils/types/abstractDtosAndModels";
import axios from "axios";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import usePagination from "../../../shared/utils/hooks/usePagination";
import EngineGamesFilters from "./engine-games-filters/EngineGamesFilters";
import EngineGamesCard from "./engine-games-card/EngineGamesCard";
import EngineGamesEmptyCard from "./engine-games-empty-card/EngineGamesEmptyCard";

type EngineGamesProps = {};

function EngineGames({}: EngineGamesProps) {
  ///

  const { showPopup } = usePopup();
  const { scrollRef, pageNumber, pageSize, totalItemsCount, setDefPageSize, setTotalItemsCount } = usePagination();

  // obtained game list
  const [games, setGames] = useState<GetAllEngineGamesDto[] | null>(null);
  const [itemsCount, setItemsCount] = useState<number>(0);

  // to display filters options
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // list for setting up search filters
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

  // get all finished games
  useEffect(() => {
    const getGames = async (): Promise<void> => {
      const model: GetAllEngineGamesModel = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        resultFilters: resultFilters,
      };

      try {
        const response = await axios.get<PagedResult<GetAllEngineGamesDto>>(
          engineGameController.getAllEngineGames(model),
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
  }, [pageSize, resultFilters, pageNumber]);

  // to display filters
  const onShowFilters = () => {
    if ((games && games.length > 0) || resultFilters.length > 0) {
      setShowFilters((prev) => !prev);
    }
  };

  return (
    <div className={classes.games}>
      <div className={classes.games__header}>
        <h2 className={classes["header-title"]}>
          <IconCreator
            icons={mainPageIcons}
            iconName={"engineGames"}
            iconClass={classes["header-icon"]}
            color={mainColor.c0}
          />

          <span>Your games with engine: </span>

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
              ${(!games || games.length === 0) && resultFilters.length === 0 ? classes["disabled"] : classes["enabled"]}
            `}
            onClick={() => {
              onShowFilters();
            }}
          >
            <IconCreator
              icons={mainPageIcons}
              iconName={"filters"}
              iconClass={classes["filters-icon"]}
              color={mainColor.c0}
            />
            <span>Filters</span>
            {resultFilters.length > 0 && <span>({resultFilters.length})</span>}
          </button>
        </div>
      </div>

      {!games ? (
        <LoadingPage text="Loading games" />
      ) : games.length === 0 ? (
        <div ref={scrollRef} className={`${classes.games__list} ${classes.empty}`}>
          {Array.from({ length: pageSize }).map((_, i: number) => (
            <EngineGamesEmptyCard key={i} />
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className={classes.games__list}>
          {games.map((game: GetAllEngineGamesDto, i: number) => (
            <EngineGamesCard key={`game-${i}`} game={game} />
          ))}
        </div>
      )}

      {showFilters && <EngineGamesFilters resultFilters={resultFilters} setResultFilters={setResultFilters} />}
    </div>
  );
}

export default EngineGames;
