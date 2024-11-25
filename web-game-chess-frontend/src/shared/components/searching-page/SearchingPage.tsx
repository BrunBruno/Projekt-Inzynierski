import { useEffect, useRef, useState, MouseEvent } from "react";
import classes from "./SearchingPage.module.scss";
import IconCreator from "../icon-creator/IconCreator";
import { searchingPageIcons } from "./SearchingPageIcons";
import { usePopup } from "../../utils/hooks/usePopUp";

const numOfPawns = 8;

type SearchingPageProps = {
  // for text display
  isPrivate: boolean;
  // on cancel action
  onCancel: () => Promise<void>;
  //
  gameUrl?: string;
  // ids for tests
  containerTestId?: string;
  cancelButtonTestId?: string;
};

function SearchingPage({
  isPrivate,
  onCancel,
  gameUrl,
  containerTestId,
  cancelButtonTestId,
}: SearchingPageProps): JSX.Element {
  ///

  const { showPopup } = usePopup();

  const indRef = useRef<HTMLElement>(null);

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
      // onCancel();
    };
  }, []);

  // auto copy icon display
  const showUrlIndicator = (event: MouseEvent<HTMLDivElement>): void => {
    const indEle = indRef.current;
    const parentContainer = event.currentTarget;

    if (!indEle) return;
    indEle.classList.remove(classes.show);

    if (!indEle.classList.contains(classes.show)) {
      indEle.classList.add(classes.show);

      const rect = parentContainer.getBoundingClientRect();

      indEle.style.left = `${event.clientX - rect.left}px`;
    }
  };

  const hideUrlIndicator = (): void => {
    const indEle = indRef.current;

    if (!indEle) return;
    indEle.classList.remove(classes.show);
  };

  // auto url copy
  const copyUrl = async (): Promise<void> => {
    if (!gameUrl) return;

    const textToCopy = gameUrl;

    await navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showPopup("LINK COPIED", "info");
      })
      .catch(() => {
        showPopup("ERROR COPING LINK", "warning");
      });
  };

  return (
    <div data-testid={containerTestId} className={classes.searching}>
      <div className={classes.searching__content}>
        <div className={classes.searching__content__background}>
          <IconCreator icons={searchingPageIcons} iconName={"globe"} active={activeIndex !== 0} />
        </div>

        {gameUrl === undefined || gameUrl === "" ? (
          <div className={classes.searching__content__text}>
            {isPrivate ? (
              <h1 className={classes["h1-header"]}>Waiting for opponent...</h1>
            ) : (
              <h1 className={classes["h1-header"]}>Searching for Game...</h1>
            )}
          </div>
        ) : (
          <div className={classes.searching__content__text}>
            <h1 className={classes["h1-header"]}>Invite Your Friend to Join!</h1>
            <span>Share the link below with your friend to start the game. They can join by clicking on the link.</span>
            <p
              className={classes["game-url"]}
              onMouseEnter={(event) => {
                showUrlIndicator(event);
              }}
              onMouseLeave={() => {
                hideUrlIndicator();
              }}
              onClick={() => {
                copyUrl();
              }}
            >
              {gameUrl}
              <span ref={indRef}>Copy</span>
            </p>
          </div>
        )}

        <div className={classes.searching__content__indicator}>
          {Array.from({ length: numOfPawns }).map((_, index) => (
            <IconCreator
              key={index}
              icons={searchingPageIcons}
              iconName={"pawn"}
              active={index === activeIndex && !pause}
            />
          ))}
        </div>

        <button
          data-testid={cancelButtonTestId}
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
