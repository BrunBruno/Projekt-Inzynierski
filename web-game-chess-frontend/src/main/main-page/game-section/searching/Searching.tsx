import { useEffect, useState } from "react";
import classes from "./Searching.module.scss";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { SearchGameDto } from "../../../../shared/utils/types/gameDtos";
import GameHubService from "../../../../shared/utils/services/GameHubService";
import { GameSearchInterface } from "../../../../shared/utils/enums/interfacesEnums";
import { AbortSearchModel } from "../../../../shared/utils/types/gameModels";
import { getErrMessage } from "../../../../shared/utils/functions/displayError";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { searchingIcons } from "./SearchingIcons";

const numOfPawns = 8;

type SearchingProps = {
  // to set to player search content after searching cancelation
  setInterfaceById: (interfaceId: number) => void;
  // obtained search ids
  searchIds: SearchGameDto | null;
  // to clear search ids
  setSearchIds: React.Dispatch<React.SetStateAction<SearchGameDto | null>>;
};

function Searching({ setInterfaceById, searchIds, setSearchIds }: SearchingProps) {
  ///

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

  const { showPopup } = usePopup();

  // searching pawns animation
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
  // remove player, clear ids and go back to vs-player search
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

      setInterfaceById(GameSearchInterface.vsPlayer);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  return (
    <div className={classes.searching}>
      <div className={classes.searching__content}>
        <div className={classes.searching__content__background}>
          <IconCreator icons={searchingIcons} iconName="globe" iconClass="" color="none" active={activeIndex !== 0} />
        </div>
        <div className={classes.searching__content__text}>
          <h1>Searching for Game</h1>
        </div>
        <div className={classes.searching__content__indicator}>
          {Array.from({ length: numOfPawns }).map((_, index) => (
            <IconCreator
              key={index}
              icons={searchingIcons}
              iconName="pawn"
              iconClass=""
              color="none"
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
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Searching;
