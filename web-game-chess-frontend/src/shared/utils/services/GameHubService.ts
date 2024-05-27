import * as signalR from "@microsoft/signalr";
import {
  AcceptInvitationModel,
  EndGameModel,
  MakeMoveModel,
  NotifyUserModel,
} from "../types/gameModels";

// singalR hub service map from GameHub
class GameHub {
  private gameHubUrl: string = "http://localhost:5125/game-hub";
  public connection: signalR.HubConnection | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.initializeConnection(this.token);
    }
  }

  // initialize connection
  private initializeConnection(token: string): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.gameHubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
      })
      .configureLogging(signalR.LogLevel.None)
      .build();
  }

  // method to start connection when token is available
  public async startConnectionWithToken(token: string): Promise<void> {
    this.token = token;
    this.initializeConnection(token);
    return this.startConnection();
  }

  // to start try to start connection
  private async startConnection(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error(err);
      // setTimeout(() => this.startConnection(), 5000);
    }
  }

  // add user to self gropu
  public async AddSelfNotification(): Promise<void> {
    try {
      await this.connection?.invoke("add-self-notification");
    } catch (err) {
      console.error(err);
    }
  }

  // add player to queue | create game
  public async PlayerJoined(typeId: string): Promise<void> {
    try {
      await this.connection?.invoke("player-joined", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // update game | add move
  public async MakeMove(makeMoveModel: MakeMoveModel): Promise<void> {
    try {
      await this.connection?.invoke("make-move", makeMoveModel);
    } catch (err) {
      console.error(err);
    }
  }

  // change game to finished
  public async EndGame(elsendGameModel: EndGameModel): Promise<void> {
    try {
      await this.connection?.invoke("end-game", elsendGameModel);
    } catch (err) {
      console.error(err);
    }
  }

  //
  public async AcceptInvitation(model: AcceptInvitationModel) {
    try {
      await this.connection?.invoke("accept-invitation", model);
    } catch (err) {
      console.error(err);
    }
  }

  // add to group with game id
  public async GameStarted(gameId: string): Promise<void> {
    try {
      await this.connection?.invoke("game-started", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  //
  public async NotifyUser(model: NotifyUserModel): Promise<void> {
    try {
      await this.connection?.invoke("notify-user", model);
    } catch (err) {
      console.error(err);
    }
  }

  // remove from queue
  public async PlayerLeaved(typeId: string): Promise<void> {
    try {
      await this.connection?.invoke("player-leaved", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // remove user from game group
  public async LeaveGame(gameId: string): Promise<void> {
    try {
      await this.connection?.invoke("leave-game", gameId);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
