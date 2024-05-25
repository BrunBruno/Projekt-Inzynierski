import { useEffect, useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import axios from "axios";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../../shared/utils/functions/apiFunctions";
import {
  CheckIfInGameDto,
  SearchGameDto,
} from "../../../shared/utils/types/gameDtos";
import Searching from "./searching/Searching";
import { useNavigate } from "react-router-dom";
import GameHubService from "../../../shared/utils/services/GameHubService";
import { gameSearchInterface } from "../../../shared/utils/enums/interfacesEnums";
import UserGames from "./user-games/UserGames";
import GameSectionIcons from "./GameSectionIcons";
import VsFriendSearch from "./vs-friend-search/VsFriendSearch";
import { CheckIfInGameModel } from "../../../shared/utils/types/gameModels";
import NotificationPopUp from "./notification-popup/NotificationPopUp";

function GameSection() {
  const navigate = useNavigate();

  const [interfaceContent, setInterfaceContent] = useState<JSX.Element>(<></>);
  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

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
          <Searching
            setInterfaceById={setInterfaceById}
            searchIds={searchIds}
            setSearchIds={setSearchIds}
          />
        );
        break;
      case gameSearchInterface.userGames:
        setInterfaceContent(<UserGames />);
        break;
    }
  };

  // handle new ids
  const handleGamesChanged = async () => {
    if (searchIds !== null) {
      const isInGameModel: CheckIfInGameModel = {
        playerId: searchIds.playerId,
      };

      const isInGameResponse = await axios.get<CheckIfInGameDto>(
        gameControllerPaths.checkIfInGame(isInGameModel),
        getAuthorization()
      );

      if (isInGameResponse.data.isInGame) {
        navigate(`game/${isInGameResponse.data.gameId}`);
      }
    }
  };

  useEffect(() => {
    if (searchIds !== null) {
      setInterfaceById(gameSearchInterface.searching);
    }

    GameHubService.connection?.on("GamesChanged", handleGamesChanged);

    return () => {
      GameHubService.connection?.off("GamesChanged", handleGamesChanged);
    };
  }, [searchIds]);

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
          </div>
        </div>

        <NotificationPopUp />
      </div>
    </section>
  );
}

export default GameSection;
