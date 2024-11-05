import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import classes from "./EngineGameLeftSidebar.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { Guid } from "guid-typescript";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { GameActionInterface } from "../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction } from "react";
import { GetEngineGameDto } from "../../../shared/utils/types/engineDtos";
import { engineGameLeftSideBarIcons } from "./EngineGameLeftSidebarIcons";

type EngineGameLeftSidebarProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  // to show confirm window
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // to set confirm action
  setConfirmAction: Dispatch<SetStateAction<() => void>>;
};

function EngineGameLeftSidebar({ gameId, gameData, setShowConfirm, setConfirmAction }: EngineGameLeftSidebarProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // to finish the game by some action option
  const endGame = async (loserColor: PieceColor | null, endGameType: GameEndReason): Promise<void> => {
    try {
      const loserPlayer: EndGameModel = {
        gameId: gameId,
        loserColor: loserColor,
        endGameType: endGameType,
      };

      await GameHubService.EndGame(loserPlayer);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // to resign the game
  const onResign = (): void => {
    endGame(gameData.player.color, GameEndReason.resignation);
  };
  //*/

  // to offer a draw

  // to show confirm window and select chosen action
  const onSelectResign = (): void => {
    setShowConfirm(GameActionInterface.resign);
    setConfirmAction(() => onResign);
  };
  //*/

  const onLeaveGame = () => {
    navigate("/main");
  };

  return (
    <section className={classes.bar}>
      <div className={classes.bar__content}>
        <div
          className={classes.bar__content__logo}
          onClick={() => {
            location.reload();
          }}
        >
          <LogoIcon iconClass={classes["logo-svg"]} />
          <p className={classes["logo-text"]}>Chess</p>
        </div>

        {/* game options */}
        <ul className={classes.bar__content__list}>
          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onLeaveGame();
            }}
          >
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"leave"} iconClass={classes["list-icon"]} />

            <span>Leave game</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectResign();
            }}
          >
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"resign"} iconClass={classes["list-icon"]} />
            <span>Resign</span>
          </li>

          <li className={classes.bar__content__list__element} onClick={() => {}}>
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"undo"} iconClass={classes["list-icon"]} />
            <span>Undo move</span>
          </li>

          <li className={classes.bar__content__list__element} onClick={() => {}}>
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"restart"} iconClass={classes["list-icon"]} />
            <span>Restart</span>
          </li>

          <li className={classes.bar__content__list__element} onClick={() => {}}>
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"engine"} iconClass={classes["list-icon"]} />
            <span>Engine</span>
          </li>

          <li className={classes.bar__content__list__element} onClick={() => {}}>
            <IconCreator icons={engineGameLeftSideBarIcons} iconName={"settings"} iconClass={classes["list-icon"]} />
            <span>Settings</span>
          </li>
        </ul>
        {/* --- */}
      </div>
    </section>
  );
}

export default EngineGameLeftSidebar;
