import { useEffect, useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import axios from "axios";
import { gameControllerPaths, getAuthorization } from "../../../shared/utils/services/ApiService";
import { CheckIfInGameDto, SearchGameDto } from "../../../shared/utils/types/gameDtos";
import Searching from "./searching/Searching";
import { useLocation, useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { gameSearchInterface } from "../../../shared/utils/enums/interfacesEnums";
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

function GameSection() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<DefaultView />);
  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);
  const [allowNotification, setAllowNotification] = useState<boolean>(false);

  const { timingType } = useTimingType();

  const { showPopup } = usePopup();

  // to set content
  useEffect(() => {
    if (location.state) {
      const state = location.state;

      if (state.interface) {
        setInterfaceById(state.interface);
      }
    }
  }, [location.state]);
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

  // to handle when frind accepeted the invitation
  // const handleGameAccepted = (gameId: string) => {
  //   if (timingType) {
  //     navigate(`game/${gameId}`, {
  //       state: {
  //         timing: timingType,
  //         popupText: "Game started",
  //         popupType: "info",
  //       },
  //     });
  //   } else {
  //     console.error("Type not set");
  //   }
  // };

  // to handle when frind declinded the invitation
  // const handleGameDeclined = () => {
  //   showPopup("Invitation declined", "error");
  // };

  // connect game hub handlers
  useEffect(() => {
    if (searchIds !== null) {
      setInterfaceById(gameSearchInterface.searching);
    }

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("GamesChanged", handleGamesChanged);
      // GameHubService.connection.on("GameAccepted", handleGameAccepted);
      // GameHubService.connection.on("InvitationDeclined", handleGameDeclined);

      setAllowNotification(true);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GamesChanged", handleGamesChanged);
        // GameHubService.connection.off("GameAccepted", handleGameAccepted);
        // GameHubService.connection.off("InvitationDeclined", handleGameDeclined);
      }
    };
  }, [searchIds, timingType]);
  //*/

  // set game section content
  const setInterfaceById = (interfaceId: number) => {
    switch (interfaceId) {
      case gameSearchInterface.vsPlayer:
        setInterfaceContent(<VsPlayerSearch setSearchIds={setSearchIds} />);
        break;

      case gameSearchInterface.vsComputer:
        setInterfaceContent(<></>);
        break;

      case gameSearchInterface.vsFriend:
        setInterfaceContent(<VsFriendSearch />);
        break;

      case gameSearchInterface.searching:
        setInterfaceContent(
          <Searching setInterfaceById={setInterfaceById} searchIds={searchIds} setSearchIds={setSearchIds} />
        );
        break;

      case gameSearchInterface.userGames:
        setInterfaceContent(<UserGames />);
        break;

      case gameSearchInterface.invitations:
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
                setInterfaceById(gameSearchInterface.vsPlayer);
              }}
            >
              <GameSectionIcons iconName="vsPlayer" />
              <span>Play vs Player</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(gameSearchInterface.vsComputer);
              }}
            >
              <GameSectionIcons iconName="vsComputer" />
              <span>Play vs Computer</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(gameSearchInterface.vsFriend);
              }}
            >
              <GameSectionIcons iconName="vsFriend" />
              <span>Play vs Friend</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(gameSearchInterface.userGames);
              }}
            >
              <GameSectionIcons iconName="userGames" />
              <span>My Games</span>
            </button>

            <button
              className={classes["interface-button"]}
              onClick={() => {
                setInterfaceById(gameSearchInterface.invitations);
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
