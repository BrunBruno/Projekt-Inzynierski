import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { specialPiecesSvgs } from "../../../../shared/svgs/iconsMap/SpecialPiecesSvgs";
import { mainColor } from "../../../../shared/utils/objects/colorMaps";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { MoveDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import classes from "./GameMoveRecord.module.scss";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";
import { StateProp } from "../../../../shared/utils/types/commonTypes";
import { getSimpleDuration } from "../../../../shared/utils/functions/datetime";

type WebGameMoveRecordProps = {
  // turn number
  recordNum: number;
  // done move dto
  move: MoveDto | null;
  // for settings previous positions
  historyPositionState?: StateProp<MoveDto | null>;
  // for showing history view
  displayedWindowState: StateProp<GameWindowInterface>;
};

function WebGameMoveRecord({ recordNum, move, historyPositionState, displayedWindowState }: WebGameMoveRecordProps) {
  ///

  // to show history view
  const displayPreviousPositions = (): void => {
    if (
      displayedWindowState.get !== GameWindowInterface.none &&
      displayedWindowState.get !== GameWindowInterface.winner &&
      displayedWindowState.get !== GameWindowInterface.history
    ) {
      return;
    }

    if (historyPositionState) {
      historyPositionState.set(move);
      displayedWindowState.set(GameWindowInterface.history);
    }
  };

  // case when game has not started yet
  if (!move) {
    return (
      <div className={`${classes.record} ${classes.empty}`}>
        {recordNum % 2 === 0 ? (
          <p className={classes.turn}>{Math.floor(recordNum / 2) + 1 + ". "}</p>
        ) : (
          <p className={classes.sep}>:</p>
        )}
        <p className={classes.move}>
          <span>---</span>
        </p>
      </div>
    );
  }

  return (
    <div className={classes.record}>
      {recordNum % 2 === 0 ? (
        <p className={classes.turn}>{Math.floor((move.turn - 1) / 2) + 1 + ""}</p>
      ) : (
        <p className={classes.sep}>:</p>
      )}
      <p
        className={`
          ${classes.move} 
          ${
            historyPositionState && historyPositionState.get && historyPositionState.get.position === move.position
              ? classes.active
              : ""
          }
        `}
        onClick={() => {
          displayPreviousPositions();
        }}
        onMouseEnter={() => {
          displayPreviousPositions();
        }}
      >
        <IconCreator
          icons={specialPiecesSvgs}
          iconName={move.move[0].toLowerCase() as PieceTag}
          color={recordNum % 2 === 0 ? mainColor.c0 : mainColor.c9}
          iconClass={classes["piece-ind"]}
        />
        <span>{move.fenMove}</span>
        <span>{getSimpleDuration(move.duration)}</span>
      </p>
    </div>
  );
}

export default WebGameMoveRecord;
