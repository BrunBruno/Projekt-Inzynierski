import axios from "axios";
import IconCreator from "../../../../shared/components/icon-creator/IconCreator";
import { symbolIcons } from "../../../../shared/svgs/iconsMap/SymbolIcons";
import { getErrMessage } from "../../../../shared/utils/functions/errors";
import { usePopup } from "../../../../shared/utils/hooks/usePopUp";
import { greyColor } from "../../../../shared/utils/objects/colorMaps";
import { gameLeftSideBarIcons } from "../../game-left-sidebar/GameLeftSidebarIcons";
import classes from "./GameEngine.module.scss";
import { engineGameController, getAuthorization } from "../../../../shared/utils/services/ApiService";
import { ChangeEngineLevelModel } from "../../../../shared/utils/types/engineGameModels";
import { Guid } from "guid-typescript";
import { Dispatch, SetStateAction } from "react";
import { GameWindowInterface } from "../../../../shared/utils/objects/interfacesEnums";

const levels: number = 20;

type GameEngineProps = {
  // game id
  gameId: Guid;
  // to closing window
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function GameEngine({ gameId, setDisplayedWindow }: GameEngineProps) {
  ///

  const { showPopup } = usePopup();

  // to change engine level
  const onChangeEngineLevel = async (level: number): Promise<void> => {
    const model: ChangeEngineLevelModel = {
      gameId: gameId,
      level: level,
    };

    try {
      await axios.put(engineGameController.changeEngineLevel(gameId), model, getAuthorization());

      window.location.reload();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to close window
  const onCancel = (): void => {
    setDisplayedWindow(GameWindowInterface.none);
  };

  return (
    <div className={classes.engine}>
      <div className={classes.engine__grid}>
        <div className={classes.engine__grid__header}>
          <h2>Select level</h2>
        </div>

        {Array.from({ length: levels }).map((_, level: number) => (
          <div
            key={`engine-level-${level}`}
            className={classes["engine-level"]}
            onClick={() => {
              onChangeEngineLevel(level + 1);
            }}
          >
            <span>{level + 1}</span>
            <IconCreator icons={gameLeftSideBarIcons} iconName={"engine"} iconClass={classes["lvl-icon"]} />
          </div>
        ))}

        <div
          className={classes[""]}
          onClick={() => {
            onCancel();
          }}
        >
          <IconCreator icons={symbolIcons} iconName={"x"} iconClass={classes["x-icon"]} color={greyColor.c5} />
        </div>
      </div>
    </div>
  );
}

export default GameEngine;
