import { useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GetGameDto, GetPlayerDto } from "../../shared/utils/types/gameDtos";
import {
    gameControllerPaths,
    getAuthorization,
} from "../../shared/utils/functions/apiFunctions";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameBoard from "./game-board/GameBoard";
import * as signalR from "@microsoft/signalr";
import { gameHubUrl } from "../../shared/utils/functions/signalRFunctions";

function GamePage() {
    const { gameId } = useParams();

    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const [gameData, setGameData] = useState<GetGameDto | null>(null);
    const [playerData, setPlayerData] = useState<GetPlayerDto | null>(null);

    const connectionInit = async () => {
        const builder = new signalR.HubConnectionBuilder().withUrl(gameHubUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        });

        const connection = builder.build();

        connectionRef.current = connection;

        await connection.start();

        connection.invoke("GameStarted", gameId);

        connection.on("GameChanged", () => {
            getGame();
        });
    };

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

    useEffect(() => {
        connectionInit();
        getGame();
        getPlayer();
    }, []);

    if (!gameId || !gameData || !playerData) {
        return <LoadingPage />;
    }

    return (
        <main className={classes["game-main"]}>
            <div>{gameData.position}</div>
            <GameBoard
                gameId={gameId}
                gameData={gameData}
                playerData={playerData}
                connection={connectionRef.current}
            />
            <div>{gameData.position}</div>
        </main>
    );
}

export default GamePage;
