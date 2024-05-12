import { useParams } from "react-router-dom";
import classes from "./GamePage.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { GetGameDto } from "../../shared/utils/types/gameDtos";
import {
    gameControllerPaths,
    getAuthorization,
} from "../../shared/utils/functions/apiFunctions";
import LoadingPage from "../../shared/components/loading-page/LoadingPage";
import GameBoard from "./game-board/GameBoard";

function GamePage() {
    const { gameId } = useParams();
    const [gameData, setGameData] = useState<GetGameDto | null>(null);

    useEffect(() => {
        const getGame = async () => {
            try {
                if (gameId) {
                    const gameResponse = await axios.get<GetGameDto>(
                        gameControllerPaths.getGame(gameId),
                        getAuthorization()
                    );

                    console.log(gameResponse.data);

                    setGameData(gameResponse.data);
                }
            } catch (err) {
                console.log(err);
            }
        };

        getGame();
    }, []);

    if (!gameData) {
        return <LoadingPage />;
    }

    return (
        <main className={classes["game-main"]}>
            <div>{gameData.position}</div>
            <GameBoard gameData={gameData} />
            <div>{gameData.position}</div>
        </main>
    );
}

export default GamePage;
