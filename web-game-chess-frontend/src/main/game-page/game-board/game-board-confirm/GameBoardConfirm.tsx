import { Dispatch, SetStateAction } from "react";
import { GameActionInterface } from "../../../../shared/utils/enums/interfacesEnums";
import classes from "./GameBoardConfirm.module.scss";

type GameBoardConfirmProps = {
  // action to execution on confirm
  confirmAction: () => void;
  // to select correct action to confirm
  showConfirm: GameActionInterface | null;
  // to display confirm window
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
};

function GameBoardConfirm({ confirmAction, showConfirm, setShowConfirm }: GameBoardConfirmProps) {
  ///

  const renderText = (action: GameActionInterface): JSX.Element => {
    switch (action) {
      case GameActionInterface.resign:
        return <span>Resign the game?</span>;
      case GameActionInterface.draw:
        return <span>Send draw offer?</span>;
      default:
        return <></>;
    }
  };

  // to confirm action
  const onYesClick = () => {
    confirmAction();
    setShowConfirm(null);
  };
  //*/

  // to reject action
  const onNoClick = () => {
    setShowConfirm(null);
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

export default GameBoardConfirm;
