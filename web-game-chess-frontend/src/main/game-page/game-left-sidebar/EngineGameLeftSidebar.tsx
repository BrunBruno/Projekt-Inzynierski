import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import { AppearanceOfGamePage, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import classes from "./GameLeftSidebar.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { Guid } from "guid-typescript";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { GameActionInterface, GameWindowInterface, StateOptions } from "../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction } from "react";
import { GetEngineGameDto, StartEngineGameDto } from "../../../shared/utils/types/engineDtos";
import { gameLeftSideBarIcons } from "./GameLeftSidebarIcons";
import GameCapturedPieces from "./game-captured-pieces/GameCapturedPieces";
import { StartEngineGameModel, UndoMoveModel } from "../../../shared/utils/types/engineModels";
import axios from "axios";
import { engineController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { StateProp } from "../../../shared/utils/types/commonTypes";

type EngineGameLeftSidebarProps = {
  // game id
  gameId: Guid;
  // current game data
  gameData: GetEngineGameDto;
  // for refresh
  getGame: () => Promise<void>;
  // to finish game by click
  endGame: (loserColor: PieceColor | null) => Promise<void>;
  // to show confirm window with correct text
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // to set confirm action
  setConfirmAction: Dispatch<SetStateAction<() => void>>;
  // to display confirm windows
  displayedWindowState: StateProp<GameWindowInterface>;
};

function EngineGameLeftSidebar({
  gameId,
  gameData,
  getGame,
  endGame,
  setShowConfirm,
  setConfirmAction,
  displayedWindowState,
}: EngineGameLeftSidebarProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // to resign the game
  const onResign = (): void => {
    endGame(gameData.player.color);
  };
  //*/

  // to offer a draw

  // to show confirm window and select chosen action
  const onSelectResign = (): void => {
    if (displayedWindowState.get !== GameWindowInterface.none) return;

    displayedWindowState.set(GameWindowInterface.confirm);
    setShowConfirm(GameActionInterface.resign);
    setConfirmAction(() => onResign);
  };
  //*/

  const onLeaveGame = (): void => {
    navigate("/main");
  };

  // move undoing
  const onUndoMove = async (): Promise<void> => {
    if (!gameData.allowUndo) return;

    const model: UndoMoveModel = {
      gameId: gameId,
    };

    try {
      await axios.put(engineController.undoMove(gameId), model, getAuthorization());

      showPopup("MOVE UNDONE", "success");

      getGame();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // for game restart
  const onRestartGame = async (): Promise<void> => {
    const model: StartEngineGameModel = {
      type: gameData.timingType,
      minutes: null,
      increment: null,
      allowUndo: gameData.allowUndo,
      engineLevel: gameData.engineLevel,
    };

    try {
      const response = await axios.post<StartEngineGameDto>(
        engineController.startEngineGame(),
        model,
        getAuthorization()
      );

      const state: StateOptions = {
        popup: { text: "GAME STARTED", type: "info" },
      };

      navigate(`/main/engine-game/${response.data.gameId}`, { state: state });

      window.location.reload(); //???
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  const onChangeEngine = async (): Promise<void> => {
    if (displayedWindowState.get !== GameWindowInterface.none) return;

    displayedWindowState.set(GameWindowInterface.engine);
  };

  const onShowSettings = (): void => {
    if (displayedWindowState.get !== GameWindowInterface.none) return;

    displayedWindowState.set(GameWindowInterface.settings);
  };

  return (
    <section
      className={`
        ${classes.bar} 
        ${gameData.gameSettings.appearanceOfGamePage === AppearanceOfGamePage.Simple ? classes["simple-view"] : ""}
      `}
    >
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
            <IconCreator icons={gameLeftSideBarIcons} iconName={"leave"} iconClass={classes["list-icon"]} />

            <span>Leave game</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onRestartGame();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"restart"} iconClass={classes["list-icon"]} />
            <span>Restart</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectResign();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"resign"} iconClass={classes["list-icon"]} />
            <span>Resign</span>
          </li>

          <li
            className={`
              ${classes.bar__content__list__element} 
              ${!gameData.allowUndo ? classes["un-active"] : ""}`}
            onClick={() => {
              onUndoMove();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"undo"} iconClass={classes["list-icon"]} />
            <span>Undo move</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onChangeEngine();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"engine"} iconClass={classes["list-icon"]} />
            <span>Engine</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onShowSettings();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"settings"} iconClass={classes["list-icon"]} />
            <span>Settings</span>
          </li>
        </ul>
        {/* --- */}

        <div className={classes.bar__content__captures}>
          <GameCapturedPieces gameData={gameData} />
        </div>
      </div>
    </section>
  );
}

export default EngineGameLeftSidebar;
