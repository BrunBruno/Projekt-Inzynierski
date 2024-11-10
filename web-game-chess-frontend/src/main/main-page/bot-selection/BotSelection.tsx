import { Dispatch, SetStateAction, useEffect, useState } from "react";
import classes from "./BotSelection.module.scss";
import { botSelectionIcons } from "./BotSelectionIcons";
import { OfflineGameOptions } from "../MainPageData";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import ActionButton from "../../../shared/components/action-button/ActionButton";
import { greyColor } from "../../../shared/utils/objects/colorMaps";

const levels: number = 20;

type BotSelectionProps = {
  //
  setOfflineGameOptions: Dispatch<SetStateAction<OfflineGameOptions | null>>;
};

function BotSelection({ setOfflineGameOptions }: BotSelectionProps) {
  ///

  // temporary options
  const [gameOptions, setGameOptions] = useState<OfflineGameOptions | null>(null);

  // set default options
  useEffect(() => {
    if (gameOptions != null) return;

    const options: OfflineGameOptions = {
      header: null,
      values: null,
      engineLevel: 1,
      enableTiming: false,
      enableUndo: false,
    };

    setGameOptions(options);
  }, [gameOptions]);
  //*/

  // to select options
  const onSelectLevel = (level: number) => {
    setGameOptions((prev) => (prev ? { ...prev, engineLevel: level } : prev));
  };

  const onEnableTiming = (enable: boolean) => {
    setGameOptions((prev) => (prev ? { ...prev, enableTiming: enable } : prev));
  };

  const onEnableUndo = (enable: boolean) => {
    setGameOptions((prev) => (prev ? { ...prev, enableUndo: enable } : prev));
  };
  //*/

  // confirm selection
  const onConfirmSelection = () => {
    setOfflineGameOptions(gameOptions);
  };
  //*/

  if (!gameOptions) return <></>;

  return (
    <div className={classes.bot}>
      <div className={classes.bot__content}>
        <div className={classes.bot__content__level}>
          <div className={classes.bot__content__level__header}>
            <h2>Select engine level</h2>
          </div>
          <div className={classes.bot__content__level__grid}>
            {Array.from({ length: levels }).map((_, level: number) => (
              <div
                key={`engine-level-${level}`}
                className={`
                    ${classes["engine-level"]}
                    ${gameOptions.engineLevel === level + 1 ? classes["selected"] : ""}
                `}
                onClick={() => {
                  onSelectLevel(level + 1);
                }}
              >
                <span>{level + 1}</span>
                <IconCreator icons={botSelectionIcons} iconName={"engine"} iconClass={classes["lvl-icon"]} />
              </div>
            ))}
          </div>
        </div>

        <div className={classes.bot__content__options}>
          <div className={classes.bot__content__options__option}>
            <div className={classes["option-name"]}>
              <IconCreator
                icons={botSelectionIcons}
                iconName={"timing"}
                iconClass={classes["option-icon"]}
                color={greyColor.c0}
              />

              <span>Game with timing:</span>
            </div>

            <div className={`${classes["timing-option"]} ${classes["buttons"]}`}>
              <button
                className={`
                    ${classes["option-button"]}
                    ${classes["yes-button"]} 
                    ${gameOptions.enableTiming ? classes["active-button"] : ""}
                `}
                onClick={() => {
                  onEnableTiming(true);
                }}
              >
                <span>Yes</span>
              </button>
              <button
                className={`
                    ${classes["option-button"]}
                    ${classes["no-button"]} 
                    ${!gameOptions.enableTiming ? classes["active-button"] : ""}
                `}
                onClick={() => {
                  onEnableTiming(false);
                }}
              >
                <span>No</span>
              </button>
            </div>
          </div>

          <div className={classes.bot__content__options__option}>
            <div className={classes["option-name"]}>
              <IconCreator
                icons={botSelectionIcons}
                iconName={"undo"}
                iconClass={classes["option-icon"]}
                color={greyColor.c0}
              />

              <span>Allow move undoing:</span>
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

          <div
            className={classes["continue-button"]}
            onClick={() => {
              onConfirmSelection();
            }}
          >
            <ActionButton text="Continue" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BotSelection;
