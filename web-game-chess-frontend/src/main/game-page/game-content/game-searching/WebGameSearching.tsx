import { useEffect, useState } from "react";
import classes from "./GameSearching.module.scss";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { webGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import axios from "axios";
import { AbortWebGameSearchModel } from "../../../../shared/utils/types/webGameModels";
import { SearchWebGameDto } from "../../../../shared/utils/types/webGameDtos";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { webGameSearchingIcons } from "./WebGameSearchingIcons";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

const numOfPawns = 8;

type WebGameSearchingProps = {
  // ids obtained from new game search and corresponding setter
  newGameDataState: StateProp<SearchWebGameDto | null>;
};

function WebGameSearching({ newGameDataState }: WebGameSearchingProps) {
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

  // game search abort
  const onCancelSearch = async (): Promise<void> => {
    if (!newGameDataState.get) return;

    try {
      const AbortWebGameSearchModel: AbortWebGameSearchModel = {
        playerId: newGameDataState.get.playerId,
      };

      await axios.delete(webGameController.abortSearch(AbortWebGameSearchModel), getAuthorization());

      await GameHubService.PlayerLeaved(newGameDataState.get.timingId);

      newGameDataState.set(null);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

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
