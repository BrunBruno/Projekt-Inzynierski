import { useEffect, useState } from "react";
import classes from "./GameHubSection.module.scss";
import axios from "axios";
import { webGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { CheckIfInGameDto, SearchWebGameDto } from "../../../shared/utils/types/gameDtos";
import { useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameSearchInterface, StateOptions } from "../../../shared/utils/objects/interfacesEnums";
import UserGames from "./user-games/UserGames";
import { AbortSearchModel, CheckIfInGameModel } from "../../../shared/utils/types/gameModels";
import NotificationPopUp from "./notification-popup/NotificationPopUp";
import { HubConnectionState } from "@microsoft/signalr";
import DefaultView from "./default-view/DefaultView";
import Invitations from "./invitations/Invitations";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { gameHubSectionIcons } from "./GameHubSectionIcons";
import SearchingPage from "../../../shared/components/searching-page/SearchingPage";
import { Guid } from "guid-typescript";
import ActiveGames from "./active-games/ActiveGames";
import { StartEngineGameDto } from "../../../shared/utils/types/engineDtos";
import TimeSelection from "./time-selection/TimeSelection";
import { OffileGameOptions, PrivateGameOptions } from "./GameHubSectionData";
import BotSelection from "./bot-selection/BotSelection";
import FriendSelection from "./friend-selection/FriendSelection";

type GameHubSectionProps = {
  // in case of entering page with already chosen interface by user
  providedInterface: GameSearchInterface | null;
};

function GameHubSection({ providedInterface }: GameHubSectionProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  /** online public */
  // ids for online games
  const [onlineGameIds, setOnlineGameIds] = useState<SearchWebGameDto | null>(null);

  /** online private */
  const [privateGameOptions, setPrivateGameOptions] = useState<PrivateGameOptions | null>(null);

  /** offile */
  const [offileGameOptions, setOffileGameOptions] = useState<OffileGameOptions | null>(null);
  const [offlineGameIds, setOfflineGameIds] = useState<StartEngineGameDto | null>(null);

  // current viewed interface
  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<></>);
  const [interfaceId, setInterfaceId] = useState<GameSearchInterface>(GameSearchInterface.defaultView);
  // to show new game invitation notification
  const [allowNotification, setAllowNotification] = useState<boolean>(false);

  // to set content
  useEffect(() => {
    if (providedInterface !== null) {
      setInterfaceById(providedInterface);
    }
  }, [providedInterface]);
  //*/

  /** ONLINE PUBLIC GAME */

  // to handle when joining queue has changed
  const handleGamesChanged = async (): Promise<void> => {
    if (!onlineGameIds) return;

    try {
      const isInGameModel: CheckIfInGameModel = {
        playerId: onlineGameIds.playerId,
      };

      // check if user was joined to game
      const isInGameResponse = await axios.get<CheckIfInGameDto>(
        webGameController.checkIfInGame(isInGameModel),
        getAuthorization()
      );

      if (isInGameResponse.data.isInGame) {
        const state: StateOptions = {
          popup: { text: "GAME STARTED", type: "info" },
        };

        navigate(`/main/game/${isInGameResponse.data.gameId}`, { state: state });
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // public game search abort
  // remove player, clear ids and go back to vs-player search
  const onCancelSearch = async (): Promise<void> => {
    if (!onlineGameIds) return;

    try {
      const abortSearchModel: AbortSearchModel = {
        playerId: onlineGameIds.playerId,
      };

      await axios.delete(webGameController.abortSearch(abortSearchModel), getAuthorization());

      await GameHubService.PlayerLeaved(onlineGameIds.timingId);

      setOnlineGameIds(null);

      setInterfaceById(GameSearchInterface.vsPlayerTimeSlection);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  /** ONLINE PUBLIC GAMES END */

  /** ONLINE PRIVATE GAMES */

  // to navigate to game page
  const handleGameAccepted = async (gameId: Guid): Promise<void> => {
    const state: StateOptions = {
      popup: { text: "GAME STARTED", type: "info" },
    };

    navigate(`/main/game/${gameId}`, { state: state });
  };

  const handleGameDeclined = () => {
    showPopup("INVITATION DECLINED", "error");
  };
  //*/

  useEffect(() => {
    if (privateGameOptions) {
      console.log("options changed");

      if (privateGameOptions.header === null) {
        setInterfaceById(GameSearchInterface.vsFriendTimeSelection);
      } else {
        setInterfaceById(GameSearchInterface.vsFriendsOptions);
      }
    }
  }, [privateGameOptions]);

  /** ONLINE PRIVATE GAMES END */

  // connect game hub handlers
  useEffect(() => {
    if (onlineGameIds) {
      setInterfaceById(GameSearchInterface.vsPlayerSearching);
    }

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      // for handling public search
      GameHubService.connection.on("GamesChanged", handleGamesChanged);
      // for handling private game accepted
      GameHubService.connection.on("GameAccepted", handleGameAccepted);
      // for handling private game declined
      GameHubService.connection.on("InvitationDeclined", handleGameDeclined);

      setAllowNotification(true);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GamesChanged", handleGamesChanged);
        GameHubService.connection.off("GameAccepted", handleGameAccepted);
        GameHubService.connection.off("InvitationDeclined", handleGameDeclined);
      }
    };
  }, [onlineGameIds]);
  //*/

  /** OFFLINE GAMES */

  // start offline game
  useEffect(() => {
    if (!offlineGameIds) return;

    const state: StateOptions = {
      popup: { text: "GAME STARTED", type: "info" },
    };

    navigate(`/main/engine-game/${offlineGameIds.gameId}`, { state: state });
  }, [offlineGameIds]);
  //*/

  // go to timing selection for offlne game
  useEffect(() => {
    setInterfaceById(GameSearchInterface.vsComputerTimeSelection);
  }, [offileGameOptions]);
  //*/

  /** OFFLINE GAMES END */

  // set game section content
  const setInterfaceById = (interfaceId: GameSearchInterface): void => {
    setInterfaceId(interfaceId);

    switch (interfaceId) {
      case GameSearchInterface.defaultView:
        setInterfaceContent(<DefaultView setInterfaceById={setInterfaceById} />);
        break;

      case GameSearchInterface.vsPlayerTimeSlection:
        setInterfaceContent(<TimeSelection setOnlineGameIds={setOnlineGameIds} />);
        break;

      case GameSearchInterface.vsPlayerSearching:
        setInterfaceContent(
          <SearchingPage
            isPrivate={false}
            onCancel={onCancelSearch}
            containerTestId="searching-page-vs-player-search"
            cancelButtonTestId="searching-page-vs-player-cancel-button"
          />
        );
        break;

      case GameSearchInterface.vsComputerOptions:
        setInterfaceContent(<BotSelection setOffileGameOptions={setOffileGameOptions} />);
        break;

      case GameSearchInterface.vsComputerTimeSelection:
        setInterfaceContent(<TimeSelection setOfflineGameIds={setOfflineGameIds} />);
        break;

      case GameSearchInterface.vsFriendsOptions:
        setInterfaceContent(
          <FriendSelection setPrivateGameOptions={setPrivateGameOptions} privateGameOptions={privateGameOptions} />
        );
        break;

      case GameSearchInterface.vsFriendTimeSelection:
        setInterfaceContent(<TimeSelection setPrivateGameOptions={setPrivateGameOptions} />);
        break;

      case GameSearchInterface.activeGames:
        setInterfaceContent(<ActiveGames />);
        break;

      case GameSearchInterface.userGames:
        setInterfaceContent(<UserGames />);
        break;

      case GameSearchInterface.invitations:
        setInterfaceContent(<Invitations />);
        break;

      default:
        setInterfaceContent(<DefaultView setInterfaceById={setInterfaceById} />);
        break;
    }
  };
  //*/

  // set default interface
  useEffect(() => {
    setInterfaceById(GameSearchInterface.defaultView);
  }, []);
  ///*

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        <div className={classes.game__content__col}>
          <div className={classes["game-interface"]}>{interfaceContent}</div>
        </div>
        <div className={classes.game__content__col}>
          <div className={classes["game-buttons"]}>
            <button
              data-testid="main-page-game-hub-default-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.defaultView ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.defaultView);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"home"} />
              <span>Home</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-player-button"
              className={`
                ${classes["interface-button"]}
                ${
                  interfaceId === GameSearchInterface.vsPlayerTimeSlection ||
                  interfaceId === GameSearchInterface.vsPlayerSearching
                    ? classes["active-button"]
                    : ""
                }
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsPlayerTimeSlection);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsPlayer"} />
              <span>Play vs Player</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-computer-button"
              className={`
                ${classes["interface-button"]}
                ${
                  interfaceId === GameSearchInterface.vsComputerOptions ||
                  interfaceId === GameSearchInterface.vsComputerTimeSelection
                    ? classes["active-button"]
                    : ""
                }
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsComputerOptions);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsComputer"} />
              <span>Play vs Computer</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-friend-button"
              className={`
                ${classes["interface-button"]}
                ${
                  interfaceId === GameSearchInterface.vsFriendsOptions ||
                  interfaceId === GameSearchInterface.vsFriendTimeSelection
                    ? classes["active-button"]
                    : ""
                }
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsFriendsOptions);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsFriend"} />
              <span>Play vs Friend</span>
            </button>

            <button
              data-testid="main-page-game-hub-active-games-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.activeGames ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.activeGames);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"activeGames"} />
              <span>Active games</span>
            </button>

            <button
              data-testid="main-page-game-hub-user-games-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.userGames ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.userGames);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"userGames"} />
              <span>My Games</span>
            </button>

            <button
              data-testid="main-page-game-hub-invitations-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.invitations ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.invitations);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"gameInvitations"} />
              <span>Invitations</span>
            </button>
          </div>
        </div>

        <NotificationPopUp allowNotification={allowNotification} setAllowNotification={setAllowNotification} />
      </div>
    </section>
  );
}

export default GameHubSection;
