import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckIfInGameDto,
  CreateRematchGameDto,
  EndGameDto,
  FetchTimeDto,
  GetEndedGameDto,
  GetGameDto,
  GetGameTimingDto,
  GetPlayerDto,
  SearchWebGameDto,
} from "../../shared/utils/types/gameDtos";
import { webGameController, getAuthorization } from "../../shared/utils/services/ApiService";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameHubService from "../../shared/utils/services/GameHubService";
import { CheckIfInGameModel } from "../../shared/utils/types/gameModels";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/errors";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { Guid } from "guid-typescript";
import { HubConnectionState } from "@microsoft/signalr";
import { GameActionInterface, GameWindowInterface, StateOptions } from "../../shared/utils/objects/interfacesEnums";
import WebGameLeftSidebar from "./game-left-sidebar/WebGameLeftSidebar";
import WebGameContent from "./game-content/WebGameContent";
import WebGameRightSidebar from "./game-right-sidebar/WebGameRightSidebar";

function WebGamePage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  // navigate to main after critical error
  const [isCriticalError, setIsCriticalError] = useState<boolean>(false);
  useEffect(() => {
    if (isCriticalError) {
      const state: StateOptions = {
        popup: { text: "ERROR STARTING GAME", type: "error" },
      };

      navigate("/main", { state: state });
    }
  }, [isCriticalError]);
  //*/

  // obtained game id from url
  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  const [gameId, setGameId] = useState<Guid | null>(null);

  // selected timing and ids in case of new game or rematch
  const [selectedTiming, setSelectedTiming] = useState<GetGameTimingDto | null>(null);
  const [searchIds, setSearchIds] = useState<SearchWebGameDto | null>(null);
  // game id for rematch
  const [newGameId, setNewGameId] = useState<Guid | null>(null);

  // set game id as Guid
  useEffect(() => {
    // to get game timing
    const getGameTiming = async (id: Guid): Promise<void> => {
      try {
        const response = await axios.get<GetGameTimingDto>(webGameController.getGameTiming(id), getAuthorization());

        setSelectedTiming(response.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (gameIdStr) {
      const guid: Guid = Guid.parse(gameIdStr).toJSON().value;
      setGameId(guid);

      getGameTiming(guid);
    } else {
      setIsCriticalError(true);
    }
  }, [gameIdStr]);
  //*/

  // obtained game data
  const [gameData, setGameData] = useState<GetGameDto | null>(null);
  // obtained current player data
  const [playerData, setPlayerData] = useState<GetPlayerDto | null>(null);
  // winner data
  const [winner, setWinner] = useState<EndGameDto | GetEndedGameDto | null>(null);
  // time left for both players
  const [playersTimes, setPlayersTimes] = useState<FetchTimeDto | null>(null);

  //
  const [displayedWindow, setDisplayedWindow] = useState<GameWindowInterface>(GameWindowInterface.none);
  // states for displaying actions confirmation window
  const [showConfirm, setShowConfirm] = useState<GameActionInterface | null>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // display enter popups
  useEffect(() => {
    const locationState = location.state as StateOptions;
    if (!locationState) return;

    if (locationState.popup) {
      showPopup(locationState.popup.text, locationState.popup.type);
    }
  }, [location.state]);

  // get game data
  const getGame = async (): Promise<void> => {
    try {
      if (!gameId) return;

      const response = await axios.get<GetGameDto>(webGameController.getGame(gameId), getAuthorization());

      setGameData(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
      setIsCriticalError(true);
    }
  };

  // get player data
  const getPlayer = async (): Promise<void> => {
    try {
      if (!gameId) return;

      const response = await axios.get<GetPlayerDto>(webGameController.getPlayer(gameId), getAuthorization());

      setPlayerData(response.data);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
      setIsCriticalError(true);
    }
  };

  // to finish the game
  const endGame = (endGameData: EndGameDto): void => {
    setWinner(endGameData);
    setDisplayedWindow(GameWindowInterface.winner);

    GameHubService.connection?.off("GameUpdated", getGame);
  };

  //
  const setRematch = (rematchData: CreateRematchGameDto) => {
    setNewGameId(rematchData.gameId);
  };

  //
  const handleGameAccepted = (newGameId: Guid): void => {
    const state: StateOptions = {
      popup: { text: "GAME STARTED", type: "info" },
    };

    navigate(`/main/game/${newGameId}`, { state: state });

    window.location.reload(); //???
  };

  // add game hub listeners
  // first fetch for game data
  useEffect(() => {
    // starts game - adds player to hub group
    // must run after each refresh
    const addPlayerToGameGroup = async (): Promise<void> => {
      if (!gameId) return;

      await GameHubService.AddPlayer(gameId);
    };

    addPlayerToGameGroup();
    GameHubService.connection?.on("GameUpdated", getGame);
    GameHubService.connection?.on("GameEnded", endGame);
    GameHubService.connection?.on("RematchRequested", setRematch);
    GameHubService.connection?.on("GameAccepted", handleGameAccepted);

    getGame();
    getPlayer();

    return () => {
      GameHubService.connection?.off("GameUpdated", getGame);
      GameHubService.connection?.off("GameEnded", endGame);
      GameHubService.connection?.off("RematchRequested", setRematch);
      GameHubService.connection?.off("GameAccepted", handleGameAccepted);
    };
  }, [gameId]);

  // get players remaining times
  const fetchTime = async (): Promise<void> => {
    if (!gameId) return;

    try {
      const response = await axios.get<FetchTimeDto>(webGameController.fetchTime(gameId), getAuthorization());

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
        const response = await axios.get<GetEndedGameDto>(webGameController.getEndedGame(gameId), getAuthorization());

        setWinner(response.data);
        setDisplayedWindow(GameWindowInterface.winner);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (gameData.hasEnded) getWinner();

    fetchTime();
  }, [gameData]);

  // to enable new matches and rematches
  useEffect(() => {
    // handle hub service game changed event
    // to redirect to new game
    const handleGamesChanged = async (): Promise<void> => {
      if (!searchIds) return;

      try {
        const model: CheckIfInGameModel = {
          playerId: searchIds.playerId,
        };

        const response = await axios.get<CheckIfInGameDto>(webGameController.checkIfInGame(model), getAuthorization());

        if (response.data.isInGame) {
          const state: StateOptions = {
            popup: { text: "GAME STARTED", type: "info" },
          };

          navigate(`/main/game/${response.data.gameId}`, { state: state });

          window.location.reload();
        }
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (GameHubService.connection && GameHubService.connection.state === HubConnectionState.Connected) {
      GameHubService.connection.on("GamesChanged", handleGamesChanged);
    }

    return () => {
      if (GameHubService.connection) {
        GameHubService.connection.off("GamesChanged", handleGamesChanged);
      }
    };
  }, [searchIds]);
  //*/

  if (!gameId || !gameData || !playerData) return <LoadingPage />;

  return (
    <main className={classes["game-main"]}>
      <WebGameLeftSidebar
        gameId={gameId}
        playerData={playerData}
        gameData={gameData}
        setShowConfirm={setShowConfirm}
        setConfirmAction={setConfirmAction}
        setDisplayedWindow={setDisplayedWindow}
      />

      <WebGameContent
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        winner={winner}
        searchIds={searchIds}
        newGameId={newGameId}
        setSearchIds={setSearchIds}
        selectedTiming={selectedTiming}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        confirmAction={confirmAction}
        displayedWindow={displayedWindow}
        setDisplayedWindow={setDisplayedWindow}
      />

      <WebGameRightSidebar
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        playersTimes={playersTimes}
        setPlayersTimes={setPlayersTimes}
        winner={winner}
      />

      <MainPopUp />
    </main>
  );
}

export default WebGamePage;
