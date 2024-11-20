import { Dispatch, SetStateAction } from "react";
import { GameActionInterface, GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";
import classes from "./GameConfirm.module.scss";
import { StateProp } from "../../../../shared/utils/types/commonTypes";

type EngineGameConfirmProps = {
  // action to execution on confirm
  confirmAction: () => void;

  // to select correct action to confirm and display confirm window
  showConfirmState: StateProp<GameActionInterface | null>;

  // modal window id setter
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function EngineGameConfirm({ confirmAction, showConfirmState, setDisplayedWindow }: EngineGameConfirmProps) {
  ///

  // to render correct title based on user selection
  const renderText = (action: GameActionInterface): JSX.Element => {
    switch (action) {
      case GameActionInterface.resign:
        return <span>Resign the game?</span>;

      case GameActionInterface.restart:
        return <span>Start new game?</span>;

      default:
        return <span>Sure?</span>;
    }
  };

  // to confirm action
  const onYesClick = () => {
    // execute action
    confirmAction();

    // clear
    showConfirmState.set(null);
    setDisplayedWindow(GameWindowInterface.none);
  };

  // to reject action
  const onNoClick = () => {
    // clear
    showConfirmState.set(null);
    setDisplayedWindow(GameWindowInterface.none);
  };

  if (!showConfirmState || !showConfirmState.get) return <></>;

  return (
    <div className={classes.window}>
      <div className={classes.window__content}>
        <div className={classes.window__content__header}>{renderText(showConfirmState.get)}</div>
        <div className={classes.window__content__actions}>
          <button
            className={`
              ${classes["confirm-button"]}
              ${classes["yes-btn"]}
            `}
            onClick={() => {
              onYesClick();
            }}
          >
            <span>YES</span>
          </button>
          <button
            className={`
              ${classes["confirm-button"]}
              ${classes["no-btn"]}
            `}
            onClick={() => {
              onNoClick();
            }}
          >
            <span>NO</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EngineGameConfirm;
