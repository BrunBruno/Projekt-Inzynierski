import { useNavigate } from "react-router-dom";
import LogoIconSvg from "../../../shared/svgs/LogoIconSvg";
import { endGameTypes } from "../../../shared/utils/enums/entitiesEnums";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GetGameDto, GetPlayerDto } from "../../../shared/utils/types/gameDtos";
import { EndGameModel } from "../../../shared/utils/types/gameModels";
import classes from "./LeftSideBar.module.scss";
import LeftSideBarIcons from "./LeftSideBarIcons";

type LeftSideBarProps = {
  gameId: string;
  playerData: GetPlayerDto;
  gameData: GetGameDto;
};

function LeftSideBar({ gameId, playerData, gameData }: LeftSideBarProps) {
  const navigate = useNavigate();

  const endGame = async (loserColor: number | null, endGameType: number) => {
    const loserPlayer: EndGameModel = {
      gameId: gameId,
      loserColor: loserColor,
      endGameType: endGameType,
    };

    GameHubService.EndGame(loserPlayer);
  };

  const onAbort = () => {
    if (gameData.turn === 0 || gameData.turn === 1) {
      endGame(null, endGameTypes.agreement);
    } else {
      endGame(playerData.color, endGameTypes.resignation);
    }

    navigate("/main");
  };
  const onResign = () => {
    endGame(playerData.color, endGameTypes.resignation);
  };
  const onDrawOffer = () => {};

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
