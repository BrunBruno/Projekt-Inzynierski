import * as signalR from "@microsoft/signalr";

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
  public async MakeMove(
    gameId: string,
    position: string,
    move: string,
    oldCoor: string,
    newCoor: string,
    enPassant: string | null,
    wkm: boolean,
    wsrm: boolean,
    wlrm: boolean,
    bkm: boolean,
    bsrm: boolean,
    blrm: boolean
  ) {
    try {
      await this.connection.invoke(
        "MakeMove",
        gameId,
        position,
        move,
        oldCoor,
        newCoor,
        enPassant,
        wkm,
        wsrm,
        wlrm,
        bkm,
        bsrm,
        blrm
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
