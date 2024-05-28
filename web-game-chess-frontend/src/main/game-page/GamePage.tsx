import { useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  EndGameDto,
  FetchTimeDto,
  GetEndedGameDto,
  GetGameDto,
  GetPlayerDto,
} from "../../shared/utils/types/gameDtos";
import {
  gameControllerPaths,
  getAuthorization,
} from "../../shared/utils/functions/apiFunctions";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameBoard from "./game-board/GameBoard";
import GameHubService from "../../shared/utils/services/GameHubService";
import LeftSideBar from "./left-sidebar/LeftSideBar";
import RightSideBar from "./right-sidebar/RightSideBar";

function GamePage() {
  const { gameId } = useParams();

  const [gameData, setGameData] = useState<GetGameDto | null>(null);
  const [playerData, setPlayerData] = useState<GetPlayerDto | null>(null);
  const [winner, setWinner] = useState<EndGameDto | GetEndedGameDto | null>(
    null
  );

  const [whitePlayerSeconds, setWhitePlayerSeconds] = useState<number | null>(
    null
  );
  const [blackPlayerSeconds, setBlackPlayerSeconds] = useState<number | null>(
    null
  );

  // get game data
  const getGame = async () => {
    try {
      if (gameId) {
        const getGameResponse = await axios.get<GetGameDto>(
          gameControllerPaths.getGame(gameId),
          getAuthorization()
        );

        setGameData(getGameResponse.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get player data
  const getPlayer = async () => {
    try {
      if (gameId) {
        const getPlayerResponse = await axios.get<GetPlayerDto>(
          gameControllerPaths.getPlayer(gameId),
          getAuthorization()
        );

        setPlayerData(getPlayerResponse.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const endGame = (endGameData: EndGameDto) => {
    setWinner(endGameData);

    GameHubService.connection?.off("GameUpdated", getGame);
  };

  // first feach for game data
  useEffect(() => {
    if (!gameId) return;

    GameHubService.GameStarted(gameId);
    GameHubService.connection?.on("GameUpdated", getGame);
    GameHubService.connection?.on("GameEnded", endGame);

    getGame();
    getPlayer();

    return () => {
      GameHubService.connection?.off("GameUpdated", getGame);
      GameHubService.connection?.off("GameEnded", endGame);
    };
  }, [gameId]);

  const fetchTime = async () => {
    if (!gameId) return;

    try {
      const timeResponse = await axios.get<FetchTimeDto>(
        gameControllerPaths.fetchTime(gameId),
        getAuthorization()
      );

      setWhitePlayerSeconds(timeResponse.data.whiteTimeLeft);
      setBlackPlayerSeconds(timeResponse.data.blackTimeLeft);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!gameId || gameData === null) return;

    const getWinner = async () => {
      try {
        const winnerResponse = await axios.get<GetEndedGameDto>(
          gameControllerPaths.getEndedGame(gameId),
          getAuthorization()
        );

        setWinner(winnerResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (gameData.hasEnded) {
      getWinner();
    }

    fetchTime();
  }, [gameData]);

  if (!gameId || !gameData || !playerData) {
    return <LoadingPage />;
  }

  return (
    <main className={classes["game-main"]}>
      <LeftSideBar
        gameId={gameId}
        playerData={playerData}
        gameData={gameData}
      />
      <GameBoard
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        winner={winner}
      />
      <RightSideBar
        gameId={gameId}
        gameData={gameData}
        whitePlayerSeconds={whitePlayerSeconds}
        blackPlayerSeconds={blackPlayerSeconds}
        setWhitePlayerSeconds={setWhitePlayerSeconds}
        setBlackPlayerSeconds={setBlackPlayerSeconds}
      />
    </main>
  );
}

export default GamePage;
