import { useLocation, useNavigate } from "react-router-dom";
import { GameSearchInterface, StateOptions } from "../../shared/utils/objects/interfacesEnums";
import classes from "./MainPage.module.scss";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { CheckIfInWebGameDto, SearchWebGameDto } from "../../shared/utils/types/webGameDtos";
import { useEffect, useState } from "react";
import { OfflineGameOptions, PrivateGameOptions } from "./MainPageData";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import MainNav from "../../shared/components/main-nav/MainNav";
import DefaultView from "./default-view/DefaultView";
import Invitations from "./invitations/Invitations";
import TimeSelection from "./selection-time/TimeSelection";
import FriendSelection from "./selection-friends/FriendSelection";
import BotSelection from "./selection-bot/BotSelection";
import SearchingPage from "../../shared/components/searching-page/SearchingPage";
import GameHubService from "../../shared/utils/services/GameHubService";
import { HubConnectionState } from "@microsoft/signalr";
import { Guid } from "guid-typescript";
import { getErrMessage } from "../../shared/utils/functions/errors";
import { engineGameController, getAuthorization, webGameController } from "../../shared/utils/services/ApiService";
import axios from "axios";
import { AbortWebGameSearchModel, CheckIfInWebGameModel } from "../../shared/utils/types/webGameModels";
import { StartEngineGameDto } from "../../shared/utils/types/engineGameDtos";
import NotificationPopUp from "./notification-popup/NotificationPopUp";
import MainButtons from "./main-buttons/MainButtons";
import { StartEngineGameModel } from "../../shared/utils/types/engineGameModels";
import ActiveGames from "./user-games/ActiveGames";
import FinishedGames from "./user-games/FinishedGames";
import EngineGames from "./user-games/EngineGames";

function MainPage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const [providedInterface, setProvidedInterface] = useState<number | null>(null);

  // to display main page popups
  // to set interface content if provided
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }

    if (locationState.interface) {
      setProvidedInterface(locationState.interface);
    }
  }, [location.state]);

  /** online public */
  // ids for online games
  const [onlineGameIds, setOnlineGameIds] = useState<SearchWebGameDto | null>(null);

  /** online private */
  const [privateGameOptions, setPrivateGameOptions] = useState<PrivateGameOptions | null>(null);

  /** offline */
  const [offlineGameOptions, setOfflineGameOptions] = useState<OfflineGameOptions | null>(null);
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

  /** ONLINE PUBLIC GAME */

  // to handle when joining queue has changed
  const handleGamesChanged = async (): Promise<void> => {
    if (!onlineGameIds) return;

    try {
      const isInGameModel: CheckIfInWebGameModel = {
        playerId: onlineGameIds.playerId,
      };

      // check if user was joined to game
      const isInGameResponse = await axios.get<CheckIfInWebGameDto>(
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

  // public game search abort
  // remove player, clear ids and go back to vs-player search
  const onCancelSearch = async (): Promise<void> => {
    if (!onlineGameIds) return;

    try {
      const AbortWebGameSearchModel: AbortWebGameSearchModel = {
        playerId: onlineGameIds.playerId,
      };

      await axios.delete(webGameController.abortSearch(AbortWebGameSearchModel), getAuthorization());

      await GameHubService.PlayerLeaved(onlineGameIds.timingId);

      setOnlineGameIds(null);

      setInterfaceById(GameSearchInterface.vsPlayerTimeSelection);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

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

  useEffect(() => {
    if (privateGameOptions) {
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

  /** OFFLINE GAMES */

  // to start offline game
  const onStartOfflineGame = async (): Promise<void> => {
    if (!offlineGameOptions) return;

    const model: StartEngineGameModel = {
      engineLevel: offlineGameOptions.engineLevel ? offlineGameOptions.engineLevel : 1,
    };

    try {
      const response = await axios.post<StartEngineGameDto>(
        engineGameController.startEngineGame(),
        model,
        getAuthorization()
      );

      setOfflineGameIds(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // start offline game
  useEffect(() => {
    if (!offlineGameIds) return;

    const state: StateOptions = {
      popup: { text: "GAME STARTED", type: "info" },
    };

    navigate(`/main/engine-game/${offlineGameIds.gameId}`, { state: state });
  }, [offlineGameIds]);

  // go to timing selection for offline game
  useEffect(() => {
    if (!offlineGameOptions) return;

    onStartOfflineGame();
  }, [offlineGameOptions]);

  /** OFFLINE GAMES END */

  // set game section content
  const setInterfaceById = (interfaceId: GameSearchInterface): void => {
    setInterfaceId(interfaceId);

    switch (interfaceId) {
      case GameSearchInterface.defaultView:
        setInterfaceContent(<DefaultView setInterfaceById={setInterfaceById} setOnlineGameIds={setOnlineGameIds} />);
        break;

      case GameSearchInterface.vsPlayerTimeSelection:
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
        setInterfaceContent(<BotSelection setOfflineGameOptions={setOfflineGameOptions} />);
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

      case GameSearchInterface.finishedGames:
        setInterfaceContent(<FinishedGames />);
        break;

      case GameSearchInterface.engineGames:
        setInterfaceContent(<EngineGames />);
        break;

      case GameSearchInterface.invitations:
        setInterfaceContent(<Invitations />);
        break;

      default:
        setInterfaceContent(<DefaultView setInterfaceById={setInterfaceById} setOnlineGameIds={setOnlineGameIds} />);
        break;
    }
  };

  // set default interface
  useEffect(() => {
    setInterfaceById(GameSearchInterface.defaultView);
  }, []);
  ///*

  return (
    <main data-testid="main-main-page" className={classes.main}>
      <MainNav />

      <section className={classes.main__container}>
        <div className={classes.main__container__content}>
          <div className={classes.game__content__col}>
            <div className={classes["game-interface"]}>{interfaceContent}</div>
          </div>

          <MainButtons interfaceId={interfaceId} setInterfaceById={setInterfaceById} />

          <NotificationPopUp allowNotification={allowNotification} setAllowNotification={setAllowNotification} />
        </div>
      </section>

      <MainPopUp />
    </main>
  );
}

export default MainPage;
