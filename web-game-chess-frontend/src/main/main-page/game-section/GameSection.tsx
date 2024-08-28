import { useEffect, useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../shared/utils/services/ApiService";
import { CheckIfInGameDto, SearchGameDto } from "../../../shared/utils/types/gameDtos";
import Searching from "./searching/Searching";
import { useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameSearchInterface } from "../../../shared/utils/enums/interfacesEnums";
import UserGames from "./user-games/UserGames";
import GameSectionIcons from "./GameSectionIcons";
import VsFriendSearch from "./vs-friend-search/VsFriendSearch";
import { CheckIfInGameModel } from "../../../shared/utils/types/gameModels";
import NotificationPopUp from "./notification-popup/NotificationPopUp";
import { HubConnectionState } from "@microsoft/signalr";
import DefaultView from "./default-view/DefaultView";
import Invitations from "./invitations/Invitations";
import { getErrMessage } from "../../../shared/utils/functions/displayError";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { useTimingType } from "../../../shared/utils/hooks/useTimingType";

type GameSectionProps = {
  providedInterface: GameSearchInterface | null;
};

function GameSection({ providedInterface }: GameSectionProps) {
  ///

  const navigate = useNavigate();

  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<DefaultView />);
  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);
  const [allowNotification, setAllowNotification] = useState<boolean>(false);

  const { timingType } = useTimingType();

  const { showPopup } = usePopup();

  // to set content
  useEffect(() => {
    if (providedInterface !== null) {
      setInterfaceById(providedInterface);
    }
  }, [providedInterface]);
  //*/

  // to handle when joining queue has changed
  const handleGamesChanged = async () => {
    if (searchIds !== null) {
      try {
        const isInGameModel: CheckIfInGameModel = {
          playerId: searchIds.playerId,
        };

        const isInGameResponse = await axios.get<CheckIfInGameDto>(
          gameControllerPaths.checkIfInGame(isInGameModel),
          getAuthorization()
        );

        if (isInGameResponse.data.isInGame) {
          if (timingType) {
            navigate(`game/${isInGameResponse.data.gameId}`, {
              state: {
                timing: timingType,
                popupText: "Game started",
                popupType: "info",
              },
            });
          } else {
            console.error("Type not set");
          }
        }
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    }
  };
  //*/

  // connect game hub handlers
  useEffect(() => {
    if (searchIds !== null) {
      setInterfaceById(GameSearchInterface.searching);
    }

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("GamesChanged", handleGamesChanged);

      setAllowNotification(true);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GamesChanged", handleGamesChanged);
      }
    };
  }, [searchIds, timingType]);
  //*/

  // set game section content
  const setInterfaceById = (interfaceId: GameSearchInterface): void => {
    switch (interfaceId) {
      case GameSearchInterface.vsPlayer:
        setInterfaceContent(<VsPlayerSearch setSearchIds={setSearchIds} />);
        break;

      case GameSearchInterface.vsComputer:
        setInterfaceContent(<></>);
        break;

      case GameSearchInterface.vsFriend:
        setInterfaceContent(<VsFriendSearch />);
        break;

      case GameSearchInterface.searching:
        setInterfaceContent(
          <Searching setInterfaceById={setInterfaceById} searchIds={searchIds} setSearchIds={setSearchIds} />
        );
        break;

      case GameSearchInterface.userGames:
        setInterfaceContent(<UserGames />);
        break;

      case GameSearchInterface.invitations:
        setInterfaceContent(<Invitations />);
        break;
    }
  };
  //*/

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        <div className={classes.game__content__col}>
          <div className={classes["game-interface"]}>{interfaceContent}</div>
        </div>
        <div className={classes.game__content__col}>
          <div className={classes["game-buttons"]}>
            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsPlayer);
              }}
            >
              <GameSectionIcons iconName="vsPlayer" />
              <span>Play vs Player</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsComputer);
              }}
            >
              <GameSectionIcons iconName="vsComputer" />
              <span>Play vs Computer</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsFriend);
              }}
            >
              <GameSectionIcons iconName="vsFriend" />
              <span>Play vs Friend</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.userGames);
              }}
            >
              <GameSectionIcons iconName="userGames" />
              <span>My Games</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.invitations);
              }}
            >
              <GameSectionIcons iconName="invitations" />
              <span>Invitations</span>
            </button>
          </div>
        </div>

        <NotificationPopUp allowNotification={allowNotification} setAllowNotification={setAllowNotification} />
      </div>
    </section>
  );
}

export default GameSection;
