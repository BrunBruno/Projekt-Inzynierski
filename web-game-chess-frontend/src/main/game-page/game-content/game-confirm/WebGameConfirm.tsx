import { Dispatch, SetStateAction } from "react";
import { GameActionInterface, GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";
import classes from "./GameConfirm.module.scss";

type WebGameConfirmProps = {
  // action to execution on confirm
  confirmAction: () => void;
  // to select correct action to confirm
  showConfirm: GameActionInterface | null;
  // to display confirm window
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // modal window id setter
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGameConfirm({ confirmAction, showConfirm, setShowConfirm, setDisplayedWindow }: WebGameConfirmProps) {
  ///

  // to render correct title based on user selection
  const renderText = (action: GameActionInterface): JSX.Element => {
    switch (action) {
      case GameActionInterface.leave:
        return (
          <span>
            The game will be draw. <br /> Are you sure?
          </span>
        );

      case GameActionInterface.abort:
        return (
          <span>
            The game will be resign. <br /> Are you sure?
          </span>
        );

      case GameActionInterface.resign:
        return <span>Resign the game?</span>;

      case GameActionInterface.draw:
        return <span>Send draw offer?</span>;

      default:
        return <></>;
    }
  };
  //*/

  // to confirm action
  const onYesClick = () => {
    // execute action
    confirmAction();

    // clear
    setShowConfirm(null);
    setDisplayedWindow(GameWindowInterface.none);
  };
  //*/

  // to reject action
  const onNoClick = () => {
    // clear
    setShowConfirm(null);
    setDisplayedWindow(GameWindowInterface.none);
  };
  //*/

  if (showConfirm === null) return <></>;

  return (
    <div className={classes.window}>
      <div className={classes.window__content}>
        <div className={classes.window__content__header}>{renderText(showConfirm)}</div>
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
            Yes
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
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default WebGameConfirm;
