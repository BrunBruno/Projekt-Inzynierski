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
import {
  GetEngineGameDto,
  GetEngineGameWinnerDto,
  StartEngineGameDto,
} from "../../../shared/utils/types/engineGameDtos";
import { gameLeftSideBarIcons } from "./GameLeftSidebarIcons";
import GameCapturedPieces from "./game-captured-pieces/GameCapturedPieces";
import { StartEngineGameModel, UndoMoveModel } from "../../../shared/utils/types/engineGameModels";
import axios from "axios";
import { engineGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { StateProp } from "../../../shared/utils/types/commonTypes";

type EngineGameLeftSidebarProps = {
  // current game data
  gameId: Guid;
  gameData: GetEngineGameDto;
  // winner data
  winnerData: GetEngineGameWinnerDto | null;
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
  winnerData,
  getGame,
  endGame,
  setShowConfirm,
  setConfirmAction,
  displayedWindowState,
}: EngineGameLeftSidebarProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // to leave
  const onLeaveGame = (): void => {
    navigate("/main");
  };

  // to show confirm window and select chosen action
  const onSelectResign = (): void => {
    if (displayNotAllowed() || gameData.hasEnded) return;

    displayedWindowState.set(GameWindowInterface.confirm);
    setShowConfirm(GameActionInterface.resign);
    setConfirmAction(() => onResign);
  };

  // to resign the game
  const onResign = (): void => {
    endGame(gameData.player.color);
  };

  // move undoing
  const onUndoMove = async (): Promise<void> => {
    if (!gameData.allowCheats || gameData.hasEnded) return;

    const model: UndoMoveModel = {
      gameId: gameId,
    };

    try {
      await axios.put(engineGameController.undoMove(gameId), model, getAuthorization());

      showPopup("MOVE UNDONE", "success");

      getGame();
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to select restart options
  // shows confirm window if game is ongoing, otherwise restarts game
  const onSelectGameRestart = () => {
    if (displayedWindowState.get === GameWindowInterface.winner) {
      onRestartGame();
    }

    if (displayNotAllowed()) return;

    displayedWindowState.set(GameWindowInterface.confirm);
    setShowConfirm(GameActionInterface.restart);
    setConfirmAction(() => onRestartGame);
  };

  // for game restart
  const onRestartGame = async (): Promise<void> => {
    const model: StartEngineGameModel = {
      engineLevel: gameData.engineLevel,
    };

    try {
      const response = await axios.post<StartEngineGameDto>(
        engineGameController.startEngineGame(),
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

  // to show engine level change
  const onChangeEngine = (): void => {
    if (!gameData.allowCheats) return;

    if (displayedWindowState.get === GameWindowInterface.engine) {
      if (winnerData) displayedWindowState.set(GameWindowInterface.winner);
      else displayedWindowState.set(GameWindowInterface.none);
      return;
    }

    if (displayNotAllowed()) return;

    displayedWindowState.set(GameWindowInterface.engine);
  };

  // to show game settings
  const onShowSettings = (): void => {
    if (displayedWindowState.get === GameWindowInterface.settings) {
      if (winnerData) displayedWindowState.set(GameWindowInterface.winner);
      else displayedWindowState.set(GameWindowInterface.none);
      return;
    }

    if (displayNotAllowed()) return;

    displayedWindowState.set(GameWindowInterface.settings);
  };

  const displayNotAllowed = (): boolean => {
    if (
      displayedWindowState.get === GameWindowInterface.promotion ||
      displayedWindowState.get === GameWindowInterface.search
    ) {
      return true;
    }

    return false;
  };

  return (
    <section
      className={`
        ${classes.bar} 
        ${gameData.gameSettings.appearanceOfGamePage === AppearanceOfGamePage.Simple ? classes["simple-view"] : ""}
      `}
    >
      <div className={classes.content}>
        <div
          className={classes.content__logo}
          onClick={() => {
            location.reload();
          }}
        >
          <LogoIcon iconClass={classes["logo-svg"]} />
          <p className={classes["logo-text"]}>Chess</p>
        </div>

        {/* game options */}
        <ul className={classes.content__list}>
          <li
            className={classes.content__list__element}
            onClick={() => {
              onLeaveGame();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"leave"} iconClass={classes["list-icon"]} />

            <span>Leave game</span>
          </li>

          <li
            className={classes.content__list__element}
            onClick={() => {
              onSelectGameRestart();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"restart"} iconClass={classes["list-icon"]} />
            <span>Restart</span>
          </li>

          <li
            className={classes.content__list__element}
            onClick={() => {
              onSelectResign();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"resign"} iconClass={classes["list-icon"]} />
            <span>Resign</span>
          </li>

          <li
            className={`
              ${classes.content__list__element} 
              ${!gameData.allowCheats ? classes["un-active"] : ""}
            `}
            onClick={() => {
              onUndoMove();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"undo"} iconClass={classes["list-icon"]} />
            <span>Undo move</span>
          </li>

          <li
            className={`
              ${classes.content__list__element} 
              ${!gameData.allowCheats ? classes["un-active"] : ""}
            `}
            onClick={() => {
              onChangeEngine();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"engine"} iconClass={classes["list-icon"]} />
            <span>Engine</span>
          </li>

          <li
            className={classes.content__list__element}
            onClick={() => {
              onShowSettings();
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"settings"} iconClass={classes["list-icon"]} />
            <span>Settings</span>
          </li>
        </ul>

        <div className={classes.content__captures}>
          <GameCapturedPieces gameData={gameData} />
        </div>
      </div>
    </section>
  );
}

export default EngineGameLeftSidebar;
