import { useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { GetGameDto, GetPlayerDto } from "../../shared/utils/types/gameDtos";
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

  // first feach for game data
  useEffect(() => {
    if (gameId) {
      GameHubService.GameStarted(gameId);
      GameHubService.connection.on("GameUpdated", getGame);

      getGame();
      getPlayer();
    }
  }, [gameId]);

  if (!gameId || !gameData || !playerData) {
    return <LoadingPage />;
  }

  return (
    <main className={classes["game-main"]}>
      <LeftSideBar />
      <GameBoard gameId={gameId} gameData={gameData} playerData={playerData} />
      <RightSideBar gameData={gameData} />
    </main>
  );
}

export default GamePage;
