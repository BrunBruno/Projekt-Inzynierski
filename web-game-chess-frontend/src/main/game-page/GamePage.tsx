import { useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  EndGameDto,
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

  const [whitePlayerSeconds, setWhitePlayerSeconds] = useState<number>(0);
  const [blackPlayerSeconds, setBlackPlayerSeconds] = useState<number>(0);

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
    if (gameId) {
      GameHubService.GameStarted(gameId);
      GameHubService.connection?.on("GameUpdated", getGame);
      GameHubService.connection?.on("GameEnded", endGame);

      getGame();
      getPlayer();
    }

    return () => {
      GameHubService.connection?.off("GameUpdated", getGame);
      GameHubService.connection?.off("GameEnded", endGame);
    };
  }, [gameId]);

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

    setWhitePlayerSeconds(gameData.whitePlayer.timeLeft * 60);
    setBlackPlayerSeconds(gameData.blackPlayer.timeLeft * 60);
  }, [gameData]);

  if (!gameId || !gameData || !playerData) {
    return <LoadingPage />;
  }

  return (
    <main className={classes["game-main"]}>
      <LeftSideBar />
      <GameBoard
        gameId={gameId}
        gameData={gameData}
        playerData={playerData}
        winner={winner}
        whitePlayerSeconds={whitePlayerSeconds}
        blackPlayerSeconds={blackPlayerSeconds}
      />
      <RightSideBar
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
