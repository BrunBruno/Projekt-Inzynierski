import { useNavigate } from "react-router-dom";
import LogoIcon from "../../../shared/svgs/icons/LogoIcon";
import { GameEndReason, PieceColor } from "../../../shared/utils/objects/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import classes from "./LeftSideBar.module.scss";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { Guid } from "guid-typescript";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { leftSideBarIcons } from "./LeftSideBarIcons";
import { GameActionInterface } from "../../../shared/utils/objects/interfacesEnums";
import { Dispatch, SetStateAction } from "react";

type LeftSideBarProps = {
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
};

function LeftSideBar({ gameId, playerData, gameData, setShowConfirm, setConfirmAction }: LeftSideBarProps) {
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

  // to abort from game
  const onAbort = (): void => {
    if (gameData.turn === 0 || gameData.turn === 1) {
      endGame(null, GameEndReason.agreement);
    } else {
      endGame(playerData.color, GameEndReason.resignation);
    }

    navigate("/main");
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
      case GameActionInterface.abort:
        setConfirmAction(() => onAbort);
        break;

      case GameActionInterface.resign:
        setConfirmAction(() => onResign);
        break;

      case GameActionInterface.draw:
        setConfirmAction(() => onDrawOffer);
        break;

      default:
        setConfirmAction(() => {});
        setShowConfirm(null);
    }
  };
  //*/

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
              onSelectAction(GameActionInterface.abort);
            }}
          >
            <IconCreator icons={leftSideBarIcons} iconName={"abort"} />
            <span>Leave game</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.resign);
            }}
          >
            <IconCreator icons={leftSideBarIcons} iconName={"resign"} />
            <span>Resign</span>
          </li>

          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onSelectAction(GameActionInterface.draw);
            }}
          >
            <IconCreator icons={leftSideBarIcons} iconName={"draw"} />
            <span>Offer Draw</span>
          </li>
        </ul>
        {/* --- */}
      </div>
    </section>
  );
}

export default LeftSideBar;
