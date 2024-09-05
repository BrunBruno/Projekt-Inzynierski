import classes from "./GameBoardConfirm.module.scss";

type GameBoardConfirmProps = {
  confirmAction: () => void;
  //
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

function GameBoardConfirm({ confirmAction, setShowConfirm }: GameBoardConfirmProps) {
  ///

  // to confirm action
  const onYesClick = () => {
    confirmAction();
  };
  //*/

  // to reject action
  const onNoClick = () => {
    setShowConfirm(false);
  };
  //*/

  return (
    <div className={classes.window}>
      <div className={classes.window__content}>
        <div className={classes.window__content__header}>
          <span>Resign the game?</span>
        </div>
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
