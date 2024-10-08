import { useEffect, useState } from "react";
import classes from "./GameHubSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../shared/utils/services/ApiService";
import { CheckIfInGameDto, SearchGameDto } from "../../../shared/utils/types/gameDtos";
import { useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { GameSearchInterface } from "../../../shared/utils/objects/interfacesEnums";
import UserGames from "./user-games/UserGames";
import VsFriendSearch from "./vs-friend-search/VsFriendSearch";
import { AbortSearchModel, CheckIfInGameModel } from "../../../shared/utils/types/gameModels";
import NotificationPopUp from "./notification-popup/NotificationPopUp";
import { HubConnectionState } from "@microsoft/signalr";
import DefaultView from "./default-view/DefaultView";
import Invitations from "./invitations/Invitations";
import { getErrMessage } from "../../../shared/utils/functions/errors";
import { usePopup } from "../../../shared/utils/hooks/usePopUp";
import { useTimingType } from "../../../shared/utils/hooks/useTimingType";
import IconCreator from "../../../shared/components/icon-creator/IconCreator";
import { gameHubSectionIcons } from "./GameHubSectionIcons";
import SearchingPage from "../../../shared/components/searching-page/SearchingPage";
import { Guid } from "guid-typescript";

type GameHubSectionProps = {
  // in case of entering page with already chosen interface by user
  providedInterface: GameSearchInterface | null;
};

function GameHubSection({ providedInterface }: GameHubSectionProps) {
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

  // to navigate to game page
  // used for every private game
  const handleGameAccepted = (gameId: Guid) => {
    if (timingType) {
      navigate(`/main/await/${gameId}`, {
        state: {
          timing: timingType,
          popupText: "Game started.",
          popupType: "info",
        },
      });
    } else {
      showPopup("Error starting game.", "warning");
    }
  };

  const handleGameDeclined = () => {
    showPopup("Invitation declined.", "error");
  };
  //*/

  // connect game hub handlers
  useEffect(() => {
    if (searchIds !== null) {
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
  }, [searchIds, timingType]);
  //*/

  // public game search abort
  // remove player, clear ids and go back to vs-player search
  const onCancelSearch = async () => {
    if (!searchIds) {
      return;
    }

    try {
      const abortSearchModel: AbortSearchModel = {
        playerId: searchIds.playerId,
      };

      await axios.delete(gameControllerPaths.abortSearch(abortSearchModel), getAuthorization());

      GameHubService.PlayerLeaved(searchIds.timingId);

      setSearchIds(null);

      setInterfaceById(GameSearchInterface.vsPlayer);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };
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
        setInterfaceContent(<SearchingPage isPrivate={false} onCancel={onCancelSearch} />);
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
              <IconCreator icons={gameHubSectionIcons} iconName={"vsPlayer"} />
              <span>Play vs Player</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsComputer);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsComputer"} />
              <span>Play vs Computer</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.vsFriend);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"vsFriend"} />
              <span>Play vs Friend</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(GameSearchInterface.userGames);
              }}
            >
              <IconCreator icons={gameHubSectionIcons} iconName={"userGames"} />
              <span>My Games</span>
            </button>

            <button
              className={classes["interface-button"]}
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
