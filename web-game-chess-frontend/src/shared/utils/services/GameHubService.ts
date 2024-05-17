import * as signalR from "@microsoft/signalr";
import { EndGameModel, MakeMoveModel } from "../types/gameModels";

// singalR hub service map from GameHub
class GameHub {
  private gameHubUrl: string = "http://localhost:5125/game-hub";
  public connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.gameHubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startConnection();
  }

  // initialize connection
  private async startConnection() {
    try {
      await this.connection.start();
    } catch (err) {
      console.error(err);
      // setTimeout(() => this.startConnection(), 5000);
    }
  }

  // add player to queue | create game
  public async PlayerJoined(typeId: string) {
    try {
      await this.connection.invoke("PlayerJoined", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // remove from queue
  public async PlayerLeaved(typeId: string) {
    try {
      await this.connection.invoke("PlayerLeaved", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // add to group with game id
  public async GameStarted(gameId: string) {
    try {
      await this.connection.invoke("GameStarted", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // update game | add move
  public async MakeMove(makeMoveModel: MakeMoveModel) {
    try {
      await this.connection.invoke("MakeMove", makeMoveModel);
    } catch (err) {
      console.error(err);
    }
  }

  public async EndGame(elsendGameModel: EndGameModel) {
    try {
      await this.connection.invoke("EndGame", elsendGameModel);
    } catch (err) {
      console.error(err);
    }
  }

  public async LeaveGame(gameId: string) {
    try {
      await this.connection.invoke("LeaveGame", gameId);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
