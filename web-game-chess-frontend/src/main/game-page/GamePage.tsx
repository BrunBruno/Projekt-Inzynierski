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
import GameBoard from "./game-board/GameBoard";
import GameHubService from "../../shared/utils/services/GameHubService";
import LeftSideBar from "./left-sidebar/LeftSideBar";
import RightSideBar from "./right-sidebar/RightSideBar";
import { CheckIfInGameModel, SearchGameModel } from "../../shared/utils/types/gameModels";
import { usePopup } from "../../shared/utils/hooks/usePopUp";
import { getErrMessage } from "../../shared/utils/functions/displayError";
import MainPopUp from "../../shared/components/main-popup/MainPopUp";
import { PopupType } from "../../shared/utils/types/commonTypes";
import { Guid } from "guid-typescript";
import { HubConnectionState } from "@microsoft/signalr";

function GamePage() {
  ///

  const location = useLocation();
  const navigate = useNavigate();

  const { gameIdStr } = useParams<{ gameIdStr: string }>();
  const [gameId, setGameId] = useState<Guid | null>(null);
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

  const [gameData, setGameData] = useState<GetGameDto | null>(null);
  const [playerData, setPlayerData] = useState<GetPlayerDto | null>(null);
  const [winner, setWinner] = useState<EndGameDto | GetEndedGameDto | null>(null);

  const [whitePlayerSeconds, setWhitePlayerSeconds] = useState<number | null>(null);
  const [blackPlayerSeconds, setBlackPlayerSeconds] = useState<number | null>(null);

  const [selectedTiming, setSelectedTiming] = useState<SearchGameModel | null>(null);
  const [searchIds, setSearchIds] = useState<SearchGameDto | null>(null);

  const { showPopup } = usePopup();

  // return if no timing set
  useEffect(() => {
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
  }, [location.state]);

  // get game data
  const getGame = async (): Promise<void> => {
    try {
      if (gameId) {
        const getGameResponse = await axios.get<GetGameDto>(gameControllerPaths.getGame(gameId), getAuthorization());

        setGameData(getGameResponse.data);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  // get player data
  const getPlayer = async (): Promise<void> => {
    try {
      if (gameId) {
        const getPlayerResponse = await axios.get<GetPlayerDto>(
          gameControllerPaths.getPlayer(gameId),
          getAuthorization()
        );

        setPlayerData(getPlayerResponse.data);
      }
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  const startGame = async (): Promise<void> => {
    if (!gameId) return;

    if (sessionStorage.getItem("started") !== "true") {
      await GameHubService.GameStarted(gameId);
      sessionStorage.setItem("started", "true");
      console.log("Game started.");
    }
  };

  // to finish the game
  const endGame = (endGameData: EndGameDto): void => {
    setWinner(endGameData);

    GameHubService.connection?.off("GameUpdated", getGame);
  };

  // first feach for game data
  useEffect(() => {
    startGame();
    GameHubService.connection?.on("GameUpdated", getGame);
    GameHubService.connection?.on("GameEnded", endGame);

    getGame();
    getPlayer();

    return () => {
      GameHubService.connection?.off("GameUpdated", getGame);
      GameHubService.connection?.off("GameEnded", endGame);
    };
  }, [gameId]);

  // get players remining times
  const fetchTime = async (): Promise<void> => {
    if (!gameId) return;

    try {
      const timeResponse = await axios.get<FetchTimeDto>(gameControllerPaths.fetchTime(gameId), getAuthorization());

      setWhitePlayerSeconds(timeResponse.data.whiteTimeLeft);
      setBlackPlayerSeconds(timeResponse.data.blackTimeLeft);
    } catch (err) {
      showPopup(getErrMessage(err), "warning");
    }
  };

  useEffect(() => {
    if (!gameId || gameData === null) return;

    const getWinner = async (): Promise<void> => {
      try {
        const winnerResponse = await axios.get<GetEndedGameDto>(
          gameControllerPaths.getEndedGame(gameId),
          getAuthorization()
        );

        setWinner(winnerResponse.data);
      } catch (err) {
        showPopup(getErrMessage(err), "warning");
      }
    };

    if (gameData.hasEnded) {
      getWinner();
    }

    fetchTime();
  }, [gameData]);

  // handle hub service game changed event
  const handleGamesChanged = async (): Promise<void> => {
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
          navigate(`/main/game/${isInGameResponse.data.gameId}`, {
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

  // connect game hub methods
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

  // display enter popups
  useEffect(() => {
    if (location.state) {
      const state = location.state as PopupType;

      if (state.popupText && state.popupType) {
        showPopup(state.popupText, state.popupType);
      }
    }
  }, [location.state]);

  if (!gameId || !gameData || !playerData) return <LoadingPage />;

  return (
    <main className={classes["game-main"]}>
      <LeftSideBar gameId={gameId} playerData={playerData} gameData={gameData} />

      <GameBoard
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        winner={winner}
        searchIds={searchIds}
        setSearchIds={setSearchIds}
        selectedTiming={selectedTiming}
      />

      <RightSideBar
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        whitePlayerSeconds={whitePlayerSeconds}
        blackPlayerSeconds={blackPlayerSeconds}
        setWhitePlayerSeconds={setWhitePlayerSeconds}
        setBlackPlayerSeconds={setBlackPlayerSeconds}
      />

      <MainPopUp />
    </main>
  );
}

export default GamePage;
