import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckIfInGameDto,
  EndGameDto,
  FetchTimeDto,
  GetEndedGameDto,
  GetGameDto,
  GetPlayerDto,
  SearchGameDto,
} from "../../shared/utils/types/gameDtos";
import { gameControllerPaths, getAuthorization } from "../../shared/utils/services/ApiService";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameContent from "./game-content/GameContent";
import GameHubService from "../../shared/utils/services/GameHubService";
import LeftSideBar from "./left-sidebar/LeftSideBar";
import RightSideBar from "./right-sidebar/RightSideBar";
import { CheckIfInGameModel, SearchGameModel } from "../../shared/utils/types/gameModels";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { PopupType } from "../../shared/utils/types/commonTypes";
import { Guid } from "guid-typescript";
import { HubConnectionState } from "@microsoft/signalr";
import { GameActionInterface } from "../../shared/utils/objects/interfacesEnums";

function GamePage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  // obtained game id from url
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  const [gameId, setGameId] = useState<Guid | null>(null);

  // set game id as Guid
  useEffect(() => {
    if (gameIdStr) {
      const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guid);
    } else {
      navigate("/main", {
        state: {
          popupText: "Error starting game",
          popupType: "error",
        },
      });
    }
  }, [gameIdStr]);

  const { showPopup } = usePopup();

  // obtained game data
  const [gameData, setGameData] = useState<GetGameDto | null>(null);
  // obtained current player data
  const [playerData, setPlayerData] = useState<GetPlayerDto | null>(null);
  // winner data
  const [winner, setWinner] = useState<EndGameDto | GetEndedGameDto | null>(null);
  // time left for both players
  const [playersTimes, setPlayersTimes] = useState<FetchTimeDto | null>(null);

  // selected timing in case of new game or rematch
  const [selectedTiming, setSelectedTiming] = useState<SearchGameModel | null>(null);
  // ids for new game
  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

  // state for displaying actions confirmation window
  const [showConfirm, setShowConfirm] = useState<GameActionInterface | null>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // return if no timing set
  // display enter popups
  useEffect(() => {
    if (location.state) {
      if (location.state.timing !== null) {
        setSelectedTiming(location.state.timing);
      } else {
        navigate("/main", {
          state: {
            popupText: "Error starting game",
            popupType: "error",
          },
        });
      }

      const state = location.state as PopupType;
      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, [location.state]);

  // get game data
  const getGame = async (): Promise<void> => {
    try {
      if (gameId) {
        const response = await axios.get<GetGameDto>(gameControllerPaths.getGame(gameId), getAuthorization());

        setGameData(response.data);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get player data
  const getPlayer = async (): Promise<void> => {
    try {
      if (gameId) {
        const response = await axios.get<GetPlayerDto>(gameControllerPaths.getPlayer(gameId), getAuthorization());

        setPlayerData(response.data);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // starts game - adds player to hub group
  // must run after each refresh
  const addPlayerToGameGroup = async (): Promise<void> => {
    if (!gameId) return;

    await GameHubService.AddPlayer(gameId);
  };

  // to finish the game
  const endGame = (endGameData: EndGameDto): void => {
    setWinner(endGameData);

    GameHubService.connection?.off("GameUpdated", getGame);
  };

  // add game hub listeners
  // first fetch for game data
  useEffect(() => {
    addPlayerToGameGroup();
    GameHubService.connection?.on("GameUpdated", getGame);
    GameHubService.connection?.on("GameEnded", endGame);

    getGame();
    getPlayer();

    return () => {
      GameHubService.connection?.off("GameUpdated", getGame);
      GameHubService.connection?.off("GameEnded", endGame);
    };
  }, [gameId]);

  // get players remaining times
  const fetchTime = async (): Promise<void> => {
    if (!gameId) return;

    try {
      const response = await axios.get<FetchTimeDto>(gameControllerPaths.fetchTime(gameId), getAuthorization());

      setPlayersTimes(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // to get winner if game has ended
  useEffect(() => {
    if (!gameId || !gameData) return;

    const getWinner = async (): Promise<void> => {
      try {
        const response = await axios.get<GetEndedGameDto>(gameControllerPaths.getEndedGame(gameId), getAuthorization());

        setWinner(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (gameData.hasEnded) getWinner();

    fetchTime();
  }, [gameData]);

  // handle hub service game changed event
  // to redirect to new game
  const handleGamesChanged = async (): Promise<void> => {
    if (searchIds !== null) {
      try {
        const model: CheckIfInGameModel = {
          playerId: searchIds.playerId,
        };

        const response = await axios.get<CheckIfInGameDto>(
          gameControllerPaths.checkIfInGame(model),
          getAuthorization()
        );

        if (response.data.isInGame) {
          navigate(`/main/game/${response.data.gameId}`, {
            state: {
              timing: selectedTiming,
              popupText: "Game started",
              popupType: "info",
            },
          });

          window.location.reload();
        }
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    }
  };

  // to enable new matches and rematches
  useEffect(() => {
    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("GamesChanged", handleGamesChanged);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GamesChanged", handleGamesChanged);
      }
    };
  }, [searchIds]);

  if (!gameId || !gameData || !playerData) return <LoadingPage />;

  return (
    <main className={classes["game-main"]}>
      <LeftSideBar
        gameId={gameId}
        playerData={playerData}
        gameData={gameData}
        setShowConfirm={setShowConfirm}
        setConfirmAction={setConfirmAction}
      />

      <GameContent
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        winner={winner}
        searchIds={searchIds}
        setSearchIds={setSearchIds}
        selectedTiming={selectedTiming}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmAction={confirmAction}
      />

      <RightSideBar
        gameId={gameId}
        gameData={gameData}
        playersTimes={playersTimes}
        setPlayersTimes={setPlayersTimes}
        winner={winner}
      />

      <MainPopUp />
    </main>
  );
}

export default GamePage;
