import * as signalR from "@microsoft/signalr";

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

  private async startConnection() {
    try {
      await this.connection.start();
    } catch (err) {
      console.error(err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async PlayerJoined(typeId: string) {
    try {
      await this.connection.invoke("PlayerJoined", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  public async PlayerLeaved(typeId: string) {
    try {
      await this.connection.invoke("PlayerLeaved", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  public async GameStarted(gameId: string) {
    try {
      await this.connection.invoke("GameStarted", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  public async MakeMove(gameId: string, position: string, move: string) {
    try {
      await this.connection.invoke("MakeMove", gameId, position, move);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
