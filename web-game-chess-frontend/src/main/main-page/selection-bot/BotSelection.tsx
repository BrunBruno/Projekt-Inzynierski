import { Dispatch, Fragment, SetStateAction } from "react";
import classes from "./BotSelection.module.scss";
import { botSelectionIcons } from "./BotSelectionIcons";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { OfflineGameOptions } from "../MainPageData";
import { mainPageIcons } from "../MainPageIcons";
import { engineDifficulty, engineLevels } from "./BotSelectionData";
import { mainColor } from "../../../shared/utils/objects/colorMaps";

type BotSelectionProps = {
  // to set offline game data to start game with engine
  setOfflineGameOptions: Dispatch<SetStateAction<OfflineGameOptions | null>>;
};

function BotSelection({ setOfflineGameOptions }: BotSelectionProps) {
  ///

  // tododo

  // confirm selection after selection level
  const onSelectLevel = (level: number) => {
    const gameOptions: OfflineGameOptions = {
      engineLevel: level,
      enableUndo: false,
    };

    setOfflineGameOptions(gameOptions);
  };

  // const onEnableUndo = (enable: boolean) => {
  //   setGameOptions((prev) => (prev ? { ...prev, enableUndo: enable } : prev));
  // };

  return (
    <div className={classes.search}>
      <div className={classes.search__content}>
        <div className={classes.search__content__level}>
          <div className={classes.search__content__level__header}>
            <h2 className={classes["section-header"]}>
              <IconCreator icons={mainPageIcons} iconName={"vsComputer"} iconClass={classes["time-selection-icon"]} />
              <span>Offline Game</span>
            </h2>
          </div>
          <div className={classes.search__content__level__grid}>
            {Array.from({ length: engineLevels }).map((_, level: number) => (
              <Fragment key={`fragment-${level}`}>
                {level % 5 === 0 && (
                  <div key={`difficulty-${Math.round(level / 5)}`} className={classes["engine-difficulty"]}>
                    <IconCreator
                      icons={botSelectionIcons}
                      iconName={"emptyBot"}
                      iconClass={classes["bot-difficulty-icon"]}
                      color={
                        Math.round(level / 5) === 0
                          ? mainColor.c0
                          : Math.round(level / 5) === 1
                          ? mainColor.c3
                          : Math.round(level / 5) === 1
                          ? mainColor.c6
                          : mainColor.c9
                      }
                    />
                    <span>{engineDifficulty[Math.round(level / 5)]}</span>
                  </div>
                )}
                <div
                  key={`engine-level-${level}`}
                  className={classes["engine-level"]}
                  onClick={() => {
                    onSelectLevel(level + 1);
                  }}
                >
                  <span>{level + 1}</span>
                  <IconCreator icons={botSelectionIcons} iconName={"engine"} iconClass={classes["lvl-icon"]} />
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* <div className={classes.search__content__options}>
          <div className={classes.search__content__options__option}>
            <div className={classes["option-name"]}>
              <IconCreator
                icons={botSelectionIcons}
                iconName={"undo"}
                iconClass={classes["option-icon"]}
                color={greyColor.c0}
              />

              <span>Allow move undoing</span>
            </div>

            <div className={`${classes["undo-option"]} ${classes["buttons"]}`}>
              <button
                className={`
                    ${classes["option-button"]}
                    ${classes["yes-button"]} 
                    ${gameOptions.enableUndo ? classes["active-button"] : ""}
                `}
                onClick={() => {
                  onEnableUndo(true);
                }}
              >
                <span>Yes</span>
              </button>

              <button
                className={`
                    ${classes["option-button"]}
                    ${classes["no-button"]} 
                    ${!gameOptions.enableUndo ? classes["active-button"] : ""}
                `}
                onClick={() => {
                  onEnableUndo(false);
                }}
              >
                <span>No</span>
              </button>
            </div>
          </div>

        </div> */}
      </div>
    </div>
  );
}

export default BotSelection;
