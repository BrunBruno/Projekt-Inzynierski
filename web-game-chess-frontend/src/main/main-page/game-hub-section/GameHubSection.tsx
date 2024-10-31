import { useEffect, useRef, useState } from "react";
import classes from "./GameHubSection.module.scss";
import axios from "axios";
import { webGameController, getAuthorization } from "../../../shared/utils/services/ApiService";
import { CheckIfInGameDto, SearchWebGameDto } from "../../../shared/utils/types/gameDtos";
import { useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameSearchInterface, StateOptions } from "../../../shared/utils/objects/interfacesEnums";
import UserGames from "./user-games/UserGames";
import VsFriendSearch from "./friend-selection/FriendSelection";
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
import { InviteToPrivateGameRef } from "./GameHubSectionData";
import { TimingTypeName } from "../../../shared/utils/objects/constantLists";

type GameHubSectionProps = {
  // in case of entering page with already chosen interface by user
  providedInterface: GameSearchInterface | null;
};

function GameHubSection({ providedInterface }: GameHubSectionProps) {
  ///

  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // forward ref for private game invitations
  const inviteToPrivateGameRef = useRef<InviteToPrivateGameRef>(null);

  // ids for online games
  const [onlineGameIds, setOnlineGameIds] = useState<SearchWebGameDto | null>(null);
  // ids for offline games
  const [offlineGameIds, setOfflineGameIds] = useState<StartEngineGameDto | null>(null);

  // current viewed interface
  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<></>);
  const [interfaceId, setInterfaceId] = useState<GameSearchInterface>(GameSearchInterface.default);
  // to show new game invitation notification
  const [allowNotification, setAllowNotification] = useState<boolean>(false);

  // to set content
  useEffect(() => {
    if (providedInterface !== null) {
      setInterfaceById(providedInterface);
    }
  }, [providedInterface]);
  //*/

  // to handle when joining queue has changed
  const handleGamesChanged = async (): Promise<void> => {
    if (!onlineGameIds) return;
    try {
      const isInGameModel: CheckIfInGameModel = {
        playerId: onlineGameIds.playerId,
      };

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

  // to navigate to game page
  // used for every private game
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

  // connect game hub handlers
  useEffect(() => {
    if (onlineGameIds) {
      setInterfaceById(GameSearchInterface.searching);
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

      setInterfaceById(GameSearchInterface.vsPlayer);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
  //*/

  // start offline game
  useEffect(() => {
    if (!offlineGameIds) return;

    const state: StateOptions = {
      popup: { text: "GAME STARTED", type: "info" },
    };

    navigate(`/main/engine-game/${offlineGameIds.gameId}`, { state: state });
  }, [offlineGameIds]);
  //*/

  const onInviteToPrivateGame = (header: TimingTypeName, values: [number, number]): void => {
    if (inviteToPrivateGameRef.current) {
      inviteToPrivateGameRef.current.onInviteToPrivateGame(header, values);
    }
  };

  // set game section content
  const setInterfaceById = (interfaceId: GameSearchInterface): void => {
    setInterfaceId(interfaceId);

    switch (interfaceId) {
      case GameSearchInterface.default:
        setInterfaceContent(<DefaultView setInterfaceById={setInterfaceById} />);
        break;

      case GameSearchInterface.vsPlayer:
        setInterfaceContent(<TimeSelection setOnlineGameIds={setOnlineGameIds} />);
        break;

      case GameSearchInterface.vsComputer:
        setInterfaceContent(<TimeSelection setOfflineGameIds={setOfflineGameIds} />);
        break;

      case GameSearchInterface.vsFriend:
        setInterfaceContent(<TimeSelection onInviteToPrivateGame={onInviteToPrivateGame} />);
        break;

      case GameSearchInterface.friends:
        setInterfaceContent(<VsFriendSearch setInterfaceById={setInterfaceById} />);
        break;

      case GameSearchInterface.searching:
        setInterfaceContent(
          <SearchingPage
            isPrivate={false}
            onCancel={onCancelSearch}
            containerTestId="searching-page-vs-player-search"
            cancelButtonTestId="searching-page-vs-player-cancel-button"
          />
        );
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
    setInterfaceById(GameSearchInterface.default);
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
                ${interfaceId === GameSearchInterface.default ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.default);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"home"} />
              <span>Home</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-player-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.vsPlayer ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsPlayer);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsPlayer"} />
              <span>Play vs Player</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-computer-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.vsComputer ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsComputer);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsComputer"} />
              <span>Play vs Computer</span>
            </button>

            <button
              data-testid="main-page-game-hub-vs-friend-button"
              className={`
                ${classes["interface-button"]}
                ${interfaceId === GameSearchInterface.friends ? classes["active-button"] : ""}
              `}
              onClick={() => {
                setInterfaceById(GameSearchInterface.friends);
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
