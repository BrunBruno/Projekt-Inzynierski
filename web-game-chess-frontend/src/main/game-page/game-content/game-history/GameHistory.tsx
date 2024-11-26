import { Dispatch, SetStateAction } from "react";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import {
  changeBoardByUserSettings,
  changePiecesByUserSettings,
} from "../../../../shared/utils/chess-game/boardVisualization";
import { PieceTag } from "../../../../shared/utils/objects/constantLists";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";
import { getPieceSideColor } from "../../../../shared/utils/objects/piecesNameMaps";
import { MoveDto, PlayerDto } from "../../../../shared/utils/types/abstractDtosAndModels";
import { GetEngineGameDto } from "../../../../shared/utils/types/engineGameDtos";
import { GetWebGameDto } from "../../../../shared/utils/types/webGameDtos";
import classes from "./GameHistory.module.scss";
import { StateProp } from "../../../../shared/utils/types/commonTypes";
import { PieceColor } from "../../../../shared/utils/objects/entitiesEnums";

type GameHistoryProps = {
  //
  gameData: GetEngineGameDto | GetWebGameDto;
  playerData: PlayerDto;
  //
  historyPositionState: StateProp<MoveDto | null>;
  //
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function GameHistory({ gameData, historyPositionState, playerData, setDisplayedWindow }: GameHistoryProps) {
  ///

  // map previous positions to board
  const mapFromGamePosition = (movePosition: string): JSX.Element[] => {
    let position = playerData.color === PieceColor.white ? movePosition : movePosition.split("").reverse().join("");

    const fields: JSX.Element[] = [];

    for (let i = 0; i < position.length; i++) {
      const char = position[i];

      // push placeholder when separator
      if (char == "/") {
        fields.push(<div key={`hist-${i}`} className={classes.placeholder} />);
        continue;
      }

      if (!isNaN(parseInt(char))) {
        for (let j = 0; j < parseInt(char); j++) {
          fields.push(
            <div
              key={`hist-${j}-${i}`}
              className={`
                ${classes.field}      
                ${changeBoardByUserSettings(gameData.gameSettings.appearanceOfBoard, classes)}
              `}
            ></div>
          );
        }
      } else {
        fields.push(
          <div
            key={`hist-${i}`}
            className={`
              ${classes.field}      
              ${changeBoardByUserSettings(gameData.gameSettings.appearanceOfBoard, classes)}
            `}
          >
            <IconCreator
              icons={changePiecesByUserSettings(gameData.gameSettings.appearanceOfPieces)}
              iconName={char.toLowerCase() as PieceTag}
              iconClass={classes["piece-svg"]}
              color={getPieceSideColor(char as PieceTag)}
              active={true}
            />
          </div>
        );
      }
    }

    return fields;
  };

  // hide previous position
  const closeHistory = (): void => {
    historyPositionState.set(null);
    setDisplayedWindow(GameWindowInterface.none);
  };

  if (!historyPositionState) return <></>;

  return (
    <div
      className={classes.history}
      onClick={() => {
        closeHistory();
      }}
    >
      <div className={classes.history__container}>
        <div className={classes.history__container__board}>
          {historyPositionState.get && mapFromGamePosition(historyPositionState.get.position)}
        </div>
      </div>
    </div>
  );
}

export default GameHistory;
