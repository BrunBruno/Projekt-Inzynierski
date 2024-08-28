import { useNavigate } from "react-router-dom";
import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import { EndGameTypes, PieceColor } from "../../../shared/utils/enums/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import classes from "./LeftSideBar.module.scss";
import LeftSideBarIcons from "./LeftSideBarIcons";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import { Guid } from "guid-typescript";

type LeftSideBarProps = {
  // game id
  gameId: Guid;
  // current player data
  playerData: GetPlayerDto;
  // current game data
  gameData: GetGameDto;
};

function LeftSideBar({ gameId, playerData, gameData }: LeftSideBarProps) {
  ///

  const navigate = useNavigate();

  const { showPopup } = usePopup();

  // to finish the game by some action option
  const endGame = async (loserColor: PieceColor | null, endGameType: EndGameTypes) => {
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

  // to abort from game
  const onAbort = () => {
    if (gameData.turn === 0 || gameData.turn === 1) {
      endGame(null, EndGameTypes.agreement);
    } else {
      endGame(playerData.color, EndGameTypes.resignation);
    }

    navigate("/main");
  };
  //*/

  // to resign the game
  const onResign = () => {
    endGame(playerData.color, EndGameTypes.resignation);
  };
  //*/

  // to offer a draw
  const onDrawOffer = () => {};
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
          <LogoIconSvg iconClass={classes["logo-svg"]} />
          <p>Chess</p>
        </div>
        <ul className={classes.bar__content__list}>
          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onAbort();
            }}
          >
            <LeftSideBarIcons iconName="abort" /> <span>Leave game</span>
          </li>
          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onResign();
            }}
          >
            <LeftSideBarIcons iconName="resign" />
            <span>Resign</span>
          </li>
          <li
            className={classes.bar__content__list__element}
            onClick={() => {
              onDrawOffer();
            }}
          >
            <LeftSideBarIcons iconName="draw" />
            <span>Offer Draw</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default LeftSideBar;
