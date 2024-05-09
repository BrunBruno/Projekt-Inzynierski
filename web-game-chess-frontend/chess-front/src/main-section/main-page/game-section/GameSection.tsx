import { useEffect, useRef } from "react";
import { gameHubUrl } from "../../../shared/utils/functions/signalROptions";
import classes from "./GameSection.module.scss";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import {
  baseUrl,
  getAuthorization,
} from "../../../shared/utils/functions/getAuthorization";

function GameSection() {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const connectionInit = async () => {
    const builder = new signalR.HubConnectionBuilder().withUrl(gameHubUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    });

    const connection = builder.build();

    connectionRef.current = connection;

    await connection.start();
  };

  useEffect(() => {
    connectionInit();
  }, []);

  const searchGame = async () => {
    try {
      await axios.post(`${baseUrl}/game/search-game`, {}, getAuthorization());
    } catch (err) {
      console.log(err);
    }

    const connection = connectionRef.current;
    if (connection && connection.state === "Connected") {
      connection.invoke("PlayerJoined").catch((err) => console.error(err));
    }
  };

  return (
    <section className={classes.game}>
      <div className={classes.game__content}>
        <div className={classes.game__content__col}>
          <div className={classes["game-interface"]}></div>
        </div>
        <div className={classes.game__content__col}>
          <div className={classes["game-buttons"]}>
            <button
              onClick={() => {
                searchGame();
              }}
            >
              Play vs Player
            </button>
            <button>Play vs Computer</button>
            <button>Play vs Firiend</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameSection;
