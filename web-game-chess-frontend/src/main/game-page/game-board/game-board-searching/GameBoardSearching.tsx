import { useEffect, useState } from "react";
import GameBoardSearchingIcons from "./GameBoadrSearchingIcons";
import classes from "./GameBoardSearching.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import { AbortSearchModel } from "../../../../shared/utils/types/gameModels";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";

type GameBoardSearchingProps = {
  // ids obtained from new game search
  searchIds: SearchGameDto | null;
  // to set obatined ids
  setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
};

const numOfPawns = 8;
function GameBoardSearching({ searchIds, setSearchIds }: GameBoardSearchingProps) {
  ///

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  const { showPopup } = usePopup();

  // searching animation
  useEffect(() => {
    const delay = 100;
    const firstintervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
    }, delay);

    setTimeout(() => {
      setPause(true);

      clearInterval(firstintervalId);
    }, delay * numOfPawns);

    const intervalId = setInterval(() => {
      setPause(false);
      const innerintervalId = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
      }, delay);
      setTimeout(() => {
        setPause(true);
        clearInterval(innerintervalId);
      }, delay * numOfPawns);
    }, 1000 + delay * numOfPawns);

    return () => {
      clearInterval(firstintervalId);
      clearInterval(intervalId);

      // add here onCancelSearch when not strick mode ??
      // onCancelSearch();
    };
  }, []);
  //*/

  // game search abort
  const onCancelSearch = async () => {
    if (!searchIds) {
      return;
    }

    try {
      const abortSearchModel: AbortSearchModel = {
        playerId: searchIds.playerId,
      };

      await axios.delete(gameControllerPaths.abortSearch(abortSearchModel), getAuthorization());

      GameHubService.PlayerLeaved(searchIds.timingId);

      setSearchIds(null);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.searching}>
      <div className={classes.searching__content}>
        <div className={classes.searching__content__text}>
          <h1>Searching for Game</h1>
        </div>
        <div className={classes.searching__content__indicator}>
          {Array.from({ length: numOfPawns }).map((_, index) => (
            <GameBoardSearchingIcons key={index} iconName="pawn" active={index === activeIndex && !pause} />
          ))}
        </div>
        <button
          className={classes.cancel}
          onClick={() => {
            onCancelSearch();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GameBoardSearching;
