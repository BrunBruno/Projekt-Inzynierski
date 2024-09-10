import { useEffect, useState } from "react";
import classes from "./SearchingPage.module.scss";
import IconCreator from "../icon-creator/IconCreator";
import { searchingPageIcons } from "./SearchingPageIcons";

const numOfPawns = 8;

type SearchingPageProps = {
  // for text display
  isPrivate: boolean;
  // on cancel action
  onCancel: () => Promise<void>;
};

function SearchingPage({ isPrivate, onCancel }: SearchingPageProps) {
  ///

  // states for searching animation
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);

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

  return (
    <div className={classes.searching}>
      <div className={classes.searching__content}>
        <div className={classes.searching__content__background}>
          <IconCreator
            icons={searchingPageIcons}
            iconName="globe"
            iconClass=""
            color="none"
            active={activeIndex !== 0}
          />
        </div>

        <div className={classes.searching__content__text}>
          {isPrivate ? (
            <h1 className={classes["h1-header"]}>Waiting for opponent...</h1>
          ) : (
            <h1 className={classes["h1-header"]}>Searching for Game...</h1>
          )}
        </div>

        <div className={classes.searching__content__indicator}>
          {Array.from({ length: numOfPawns }).map((_, index) => (
            <IconCreator
              key={index}
              icons={searchingPageIcons}
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
            onCancel();
          }}
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}

export default SearchingPage;
