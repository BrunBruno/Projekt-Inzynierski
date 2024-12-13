import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import {
  AppearanceOfGamePage,
  GameEndReason,
  PieceColor,
  TimingType,
} from "../../../shared/utils/objects/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import {
  GetWebGameWinnerDto,
  GetWebGameDto,
  GetWebGamePlayerDto,
  GetOpponentDto,
} from "../../../shared/utils/types/webGameDtos";
import { EndWebGameModel, SendGameMessageModel } from "../../../shared/utils/types/webGameModels";
import classes from "./GameLeftSidebar.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { Guid } from "guid-typescript";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { GameActionInterface, GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction } from "react";
import { gameLeftSideBarIcons } from "./GameLeftSidebarIcons";
import GameCapturedPieces from "./game-captured-pieces/GameCapturedPieces";
import { StateProp } from "../../../shared/utils/types/commonTypes";
import { BlockUserModel } from "../../../shared/utils/types/friendshipModels";
import { friendshipController, getAuthorization, webGameController } from "../../../shared/utils/services/ApiService";
import axios from "axios";

type WebGameLeftSidebarProps = {
  // game and player data
  gameId: Guid;
  playerData: GetWebGamePlayerDto;
  gameData: GetWebGameDto;
  // winner data
  winnerData: GetWebGameWinnerDto | null;

  // to show confirm window with correct text
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // to set confirm action
  setConfirmAction: Dispatch<SetStateAction<() => void>>;
  // to display confirm windows
  displayedWindowState: StateProp<GameWindowInterface>;
};

function WebGameLeftSidebar({
  gameId,
  playerData,
  gameData,
  winnerData,
  setShowConfirm,
  setConfirmAction,
  displayedWindowState,
}: WebGameLeftSidebarProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // to finish the game by some action option
  const endGame = async (loserColor: PieceColor | null, endGameType: GameEndReason): Promise<void> => {
    try {
      const model: EndWebGameModel = {
        gameId: gameId,
        loserColor: loserColor,
        endGameType: endGameType,
      };

      await GameHubService.EndGame(model);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to send draw offer
  const createDrawOffer = async (): Promise<void> => {
    try {
      await GameHubService.SendDrawMessage(gameId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // draw on first moves
  const onDraw = (): void => {
    endGame(null, GameEndReason.agreement);
  };

  // to resign the game
  const onResign = (): void => {
    endGame(playerData.color, GameEndReason.resignation);
  };

  // to offer a draw
  const onDrawOffer = (): void => {
    createDrawOffer();
  };

  // lave for ended games or long games
  // draw or resign for short games
  const setLeaveOption = async (): Promise<void> => {
    if (gameData.hasEnded || winnerData !== null) {
      await GameHubService.LeaveGame(gameId);
      navigate("/main");
    }

    if (gameData.timingType === TimingType.daily || gameData.timingType === TimingType.classic) {
      await GameHubService.LeaveGame(gameId);
      navigate("/main");
    } else {
      if (
        (gameData.turn === 0 && playerData.color === PieceColor.white) ||
        (gameData.turn <= 1 && playerData.color === PieceColor.black)
      ) {
        onSelectAction(GameActionInterface.leave);
      } else {
        onSelectAction(GameActionInterface.abort);
      }
    }
  };

  const blockUser = async (): Promise<void> => {
    try {
      const response = await axios.get<GetOpponentDto>(webGameController.getOpponent(gameId), getAuthorization());

      const model: BlockUserModel = {
        userId: response.data.opponentId,
      };

      await axios.post(friendshipController.blockUser(), model, getAuthorization());

      const messageModel: SendGameMessageModel = {
        gameId: gameId,
        message: "Chat is off.",
      };

      await GameHubService.SendGameMessage(messageModel);

      showPopup("USER BLOCKED", "error");
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to display settings window
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

  // to show confirm window and select chosen action
  const onSelectAction = (action: GameActionInterface): void => {
    if (displayNotAllowed() || gameData.hasEnded) return;

    setShowConfirm(action);

    switch (action) {
      case GameActionInterface.leave: {
        displayedWindowState.set(GameWindowInterface.confirm);
        setConfirmAction(() => onDraw);
        break;
      }

      case GameActionInterface.abort: {
        displayedWindowState.set(GameWindowInterface.confirm);
        setConfirmAction(() => onResign);
        break;
      }

      case GameActionInterface.resign: {
        displayedWindowState.set(GameWindowInterface.confirm);
        setConfirmAction(() => onResign);
        break;
      }

      case GameActionInterface.draw: {
        displayedWindowState.set(GameWindowInterface.confirm);
        setConfirmAction(() => onDrawOffer);
        break;
      }

      case GameActionInterface.block: {
        displayedWindowState.set(GameWindowInterface.confirm);
        setConfirmAction(() => blockUser);
        break;
      }

      default: {
        displayedWindowState.set(GameWindowInterface.none);
        setConfirmAction(() => {});
        setShowConfirm(null);
        break;
      }
    }
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
              setLeaveOption();
            }}
          >
            {gameData.hasEnded ||
            gameData.timingType === TimingType.daily ||
            gameData.timingType === TimingType.classic ||
            (gameData.turn === 0 && playerData.color === PieceColor.white) ||
            (gameData.turn <= 1 && playerData.color === PieceColor.black) ? (
              <IconCreator icons={gameLeftSideBarIcons} iconName={"leave"} iconClass={classes["list-icon"]} />
            ) : (
              <IconCreator icons={gameLeftSideBarIcons} iconName={"resign"} iconClass={classes["list-icon"]} />
            )}
            <span>Leave game</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.resign);
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"resign"} iconClass={classes["list-icon"]} />
            <span>Resign</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.draw);
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"draw"} iconClass={classes["list-icon"]} />
            <span>Offer draw</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.block);
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"block"} iconClass={classes["list-icon"]} />
            <span>Block user</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.report);
            }}
          >
            <IconCreator icons={gameLeftSideBarIcons} iconName={"report"} iconClass={classes["list-icon"]} />
            <span>Report</span>
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

        <div className={classes.bar__content__captures}>
          <GameCapturedPieces gameData={gameData} />
        </div>
      </div>
    </section>
  );
}

export default WebGameLeftSidebar;
