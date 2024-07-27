import * as signalR from "@microsoft/signalr";
import {
  AcceptInvitationModel,
  DeclineInvitationModel,
  EndGameModel,
  MakeMoveModel,
  NotifyUserModel,
  SendMessageModel,
} from "../types/gameModels";
import { Guid } from "guid-typescript";

// singalR hub service map from GameHub
class GameHub {
  // private gameHubUrl: string = "http://localhost:5125/game-hub";
  private gameHubUrl: string = "http://192.168.1.46:5125/game-hub";
  private token: string | null = null;
  private attempts: number = 0;

  public connection: signalR.HubConnection | null = null;

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
      setTimeout(() => {
        this.attempts += 1;
        if (this.attempts <= 10) this.startConnection();
      }, 5000);
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
  public async PlayerJoined(typeId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("player-joined", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // update game | add move
  public async MakeMove(model: MakeMoveModel): Promise<void> {
    try {
      await this.connection?.invoke("make-move", model);
    } catch (err) {
      console.error(err);
    }
  }

  // to send new messages
  public async SendMessage(model: SendMessageModel) {
    try {
      await this.connection?.invoke("send-message", model);
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

  // to accept game invitations
  public async AcceptInvitation(model: AcceptInvitationModel) {
    try {
      await this.connection?.invoke("accept-invitation", model);
    } catch (err) {
      console.error(err);
    }
  }

  // add to group with game id
  public async GameStarted(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("game-started", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // notifies user about new game invitations
  public async NotifyUser(model: NotifyUserModel): Promise<void> {
    try {
      await this.connection?.invoke("notify-user", model);
    } catch (err) {
      console.error(err);
    }
  }

  // remove from queue
  public async PlayerLeaved(typeId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("player-leaved", typeId);
    } catch (err) {
      console.error(err);
    }
  }

  // remove user from game group
  public async LeaveGame(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("leave-game", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // removes invitation
  public async DeclineInvitation(model: DeclineInvitationModel): Promise<void> {
    try {
      await this.connection?.invoke("decline-invitation", model);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
