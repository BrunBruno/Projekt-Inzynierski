import { useEffect, useState } from "react";
import classes from "./GameSection.module.scss";
import VsPlayerSearch from "./vs-player-search/VsPlayerSearch";
import RoundArrowSvg from "../../../shared/svgs/RoundArrowSvg";
import { greyColor } from "../../../shared/utils/enums/colorMaps";
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
        setInterfaceContent(<></>);
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
      const isInGameResponse = await axios.get<CheckIfInGameDto>(
        gameControllerPaths.checkIfInGame(searchIds.playerId),
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

    GameHubService.connection.on("GamesChanged", handleGamesChanged);

    return () => {
      GameHubService.connection.off("GamesChanged", handleGamesChanged);
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
              onClick={() => {
                setInterfaceById(gameSearchInterface.vsPlayer);
              }}
            >
              <RoundArrowSvg
                color={greyColor.c0}
                iconClass={classes["button-icon"]}
              />
              <span>Play vs Player</span>
            </button>
            <button
              onClick={() => {
                setInterfaceById(gameSearchInterface.vsComputer);
              }}
            >
              <RoundArrowSvg
                color={greyColor.c0}
                iconClass={classes["button-icon"]}
              />
              <span>Play vs Computer</span>
            </button>
            <button
              onClick={() => {
                setInterfaceById(gameSearchInterface.vsFriend);
              }}
            >
              <RoundArrowSvg
                color={greyColor.c0}
                iconClass={classes["button-icon"]}
              />
              <span>Play vs Friend</span>
            </button>
            <button
              onClick={() => {
                setInterfaceById(gameSearchInterface.userGames);
              }}
            >
              <RoundArrowSvg
                color={greyColor.c0}
                iconClass={classes["button-icon"]}
              />
              <span>My Games</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameSection;
