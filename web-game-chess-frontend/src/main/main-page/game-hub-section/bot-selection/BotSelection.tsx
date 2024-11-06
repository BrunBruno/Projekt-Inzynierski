import { Dispatch, SetStateAction, useEffect, useState } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import classes from "./BotSelection.module.scss";
import { botSelectionIocns } from "./BotSelectionIcons";
import { OffileGameOptions } from "../GameHubSectionData";
import ActionButton from "../../../../shared/components/action-button/ActionButton";

const levels = 25;

type BotSelectionProps = {
  //
  setOffileGameOptions: Dispatch<SetStateAction<OffileGameOptions | null>>;
};

function BotSelection({ setOffileGameOptions }: BotSelectionProps) {
  ///

  const [gameOptions, setGameOptions] = useState<OffileGameOptions | null>(null);

  useEffect(() => {
    if (gameOptions != null) return;

    const optiosn: OffileGameOptions = {
      engineLevel: 1,
      enableTiming: false,
      enableUndo: false,
    };

    setGameOptions(optiosn);
  }, [gameOptions]);

  const onSelectLevel = (level: number) => {
    setGameOptions((prev) => (prev ? { ...prev, engineLevel: level } : prev));
  };

  const onEnableTiming = (enable: boolean) => {
    setGameOptions((prev) => (prev ? { ...prev, enableTiming: enable } : prev));
  };

  const onEnableUndo = (enable: boolean) => {
    setGameOptions((prev) => (prev ? { ...prev, enableUndo: enable } : prev));
  };

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
                <IconCreator icons={botSelectionIocns} iconName={"engine"} iconClass={classes["lvl-icon"]} />
              </div>
            ))}
          </div>
        </div>

        <div className={classes.bot__content__options}>
          <div className={classes.bot__content__options__option}>
            <p className={classes["option-name"]}>Game with timing:</p>

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
            <p className={classes["option-name"]}>Allow move undoing:</p>
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

          <div className={classes["continue-button"]}>
            <ActionButton text="Continue" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BotSelection;
