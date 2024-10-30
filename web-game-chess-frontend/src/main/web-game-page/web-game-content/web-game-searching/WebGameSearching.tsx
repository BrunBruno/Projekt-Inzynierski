import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./WebGameSearching.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import { AbortSearchModel } from "../../../../shared/utils/types/gameModels";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { webGameSearchingIcons } from "./WebGameSearchingIcons";

const numOfPawns = 8;

type WebGameSearchingProps = {
  // ids obtained from new game search
  searchIds: SearchGameDto | null;
  // to set obtained ids
  setSearchIds: Dispatch<SetStateAction<SearchGameDto | null>>;
};

function WebGameSearching({ searchIds, setSearchIds }: WebGameSearchingProps) {
  ///

  const { showPopup } = usePopup();

  // searching animation states
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  // searching animation
  useEffect(() => {
    const delay = 100;
    const firstIntervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
    }, delay);

    setTimeout(() => {
      setPause(true);

      clearInterval(firstIntervalId);
    }, delay * numOfPawns);

    const intervalId = setInterval(() => {
      setPause(false);

      const innerIntervalId = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % numOfPawns);
      }, delay);

      setTimeout(() => {
        setPause(true);
        clearInterval(innerIntervalId);
      }, delay * numOfPawns);
    }, 1000 + delay * numOfPawns);

    return () => {
      clearInterval(firstIntervalId);
      clearInterval(intervalId);

      // add here onCancelSearch when not strick mode ??
      // onCancelSearch();
    };
  }, []);
  //*/

  // game search abort
  const onCancelSearch = async (): Promise<void> => {
    if (!searchIds) return;

    try {
      const abortSearchModel: AbortSearchModel = {
        playerId: searchIds.playerId,
      };

      await axios.delete(webGameController.abortSearch(abortSearchModel), getAuthorization());

      await GameHubService.PlayerLeaved(searchIds.timingId);

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
          {Array.from({ length: numOfPawns }).map((_, index: number) => (
            <IconCreator
              key={index}
              icons={webGameSearchingIcons}
              iconName={"pawn"}
              active={index === activeIndex && !pause}
            />
          ))}
        </div>
        <button
          className={classes.cancel}
          onClick={() => {
            onCancelSearch();
          }}
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

export default WebGameSearching;
