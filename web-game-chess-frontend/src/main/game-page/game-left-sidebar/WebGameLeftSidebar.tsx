import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import { GameEndReason, PieceColor, TimingType } from "../../../shared/utils/objects/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import classes from "./GameLeftSidebar.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { Guid } from "guid-typescript";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { GameActionInterface, GameWindowInterface } from "../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction } from "react";
import { gameLeftSideBarIcons } from "./GameLeftSidebarIcons";

type WebGameLeftSidebarProps = {
  // game id
  gameId: Guid;
  // current player data
  playerData: GetPlayerDto;
  // current game data
  gameData: GetGameDto;
  // to show confirm window
  setShowConfirm: Dispatch<SetStateAction<GameActionInterface | null>>;
  // to set confirm action
  setConfirmAction: Dispatch<SetStateAction<() => void>>;
  //
  setDisplayedWindow: Dispatch<SetStateAction<GameWindowInterface>>;
};

function WebGameLeftSidebar({
  gameId,
  playerData,
  gameData,
  setShowConfirm,
  setConfirmAction,
  setDisplayedWindow,
}: WebGameLeftSidebarProps) {
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

  // to send draw offer
  const createDrawOffer = async (): Promise<void> => {
    try {
      await GameHubService.SendDrawMessage(gameId);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // draw on first moves
  const onDraw = (): void => {
    endGame(null, GameEndReason.agreement);
  };
  //*/

  // to resign the game
  const onResign = (): void => {
    endGame(playerData.color, GameEndReason.resignation);
  };
  //*/

  // to offer a draw
  const onDrawOffer = (): void => {
    createDrawOffer();
  };
  //*/

  // to show confirm window and select chosen action
  const onSelectAction = (action: GameActionInterface): void => {
    setShowConfirm(action);

    switch (action) {
      case GameActionInterface.leave:
        setDisplayedWindow(GameWindowInterface.confirm);
        setConfirmAction(() => onDraw);
        break;

      case GameActionInterface.abort:
        setDisplayedWindow(GameWindowInterface.confirm);
        setConfirmAction(() => onResign);
        break;

      case GameActionInterface.resign:
        setDisplayedWindow(GameWindowInterface.confirm);
        setConfirmAction(() => onResign);
        break;

      case GameActionInterface.draw:
        setDisplayedWindow(GameWindowInterface.confirm);
        setConfirmAction(() => onDrawOffer);
        break;

      default:
        setDisplayedWindow(GameWindowInterface.none);
        setConfirmAction(() => {});
        setShowConfirm(null);
    }
  };
  //*/

  const setLeaveOption = () => {
    if (gameData.timingType === TimingType.daily || gameData.timingType === TimingType.classic) {
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
              setLeaveOption();
            }}
          >
            {gameData.timingType === TimingType.daily ||
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
            <span>Offer Draw</span>
          </li>

          <li className={classes.bar__content__list__element} onClick={() => {}}>
            <IconCreator icons={gameLeftSideBarIcons} iconName={"settings"} iconClass={classes["list-icon"]} />
            <span>Settings</span>
          </li>
        </ul>
        {/* --- */}
      </div>
    </section>
  );
}

export default WebGameLeftSidebar;
