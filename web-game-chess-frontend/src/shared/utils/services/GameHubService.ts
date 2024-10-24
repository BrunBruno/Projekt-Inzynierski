/* signalR hub service map from GameHub */

import {
  AcceptInvitationModel,
  CreateRematchGameModel,
  DeclineInvitationModel,
  EndGameModel,
  MakeMoveModel,
  NotifyUserModel,
  SendGameMessageModel,
  SendMessageModel,
  TypingStatusModel,
} from "../types/gameModels";
import { Guid } from "guid-typescript";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

class GameHub {
  // hub url
  private gameHubUrl: string = "http://localhost:5125/game-hub";
  // private gameHubUrl: string = "http://192.168.1.46:5125/game-hub"

  // verification token
  private token: string | null = null;

  // attempts take to establish connection
  private attempts: number = 0;

  // signalR connection
  public connection: HubConnection | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.initializeConnection(this.token);
    }
  }

  // initialize connection
  private initializeConnection(token: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.gameHubUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.None)
      .build();
  }

  // method to start connection when token is available
  public async startConnectionWithToken(token: string): Promise<void> {
    this.token = token;
    this.initializeConnection(token);
    return await this.startConnection();
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

  // add user to self group
  public async AddSelfNotification(): Promise<void> {
    try {
      await this.connection?.invoke("add-self-notification");
    } catch (err) {
      console.error(err);
    }
  }

  // add to group with game id
  public async AddPlayer(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("add-player", gameId);
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

  // creates rematch game
  public async CreateRematchGame(model: CreateRematchGameModel): Promise<void> {
    try {
      await this.connection?.invoke("rematch", model);
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
  public async SendMessage(model: SendMessageModel): Promise<void> {
    try {
      await this.connection?.invoke("send-message", model);
    } catch (err) {
      console.error(err);
    }
  }

  // to send bot messages
  public async SendGameMessage(model: SendGameMessageModel): Promise<void> {
    try {
      await this.connection?.invoke("send-game-message", model);
    } catch (err) {
      console.error(err);
    }
  }

  // to send draw offer
  public async SendDrawMessage(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("send-draw", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // change game to finished
  public async EndGame(model: EndGameModel): Promise<void> {
    try {
      await this.connection?.invoke("end-game", model);
    } catch (err) {
      console.error(err);
    }
  }

  // to accept game rematch
  public async AcceptRematch(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("accept-rematch", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // to accept game invitations
  public async AcceptInvitation(model: AcceptInvitationModel): Promise<void> {
    try {
      await this.connection?.invoke("accept-invitation", model);
    } catch (err) {
      console.error(err);
    }
  }

  // updates game created with link
  public async UpdatePrivateGame(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("update-private-game", gameId);
    } catch (err) {
      console.error(err);
    }
  }

  // for typing indicator update
  public async TypingStatus(model: TypingStatusModel): Promise<void> {
    try {
      await this.connection?.invoke("typing-status", model);
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

  // to decline draw
  public async RemoveDrawMessage(gameId: Guid): Promise<void> {
    try {
      await this.connection?.invoke("remove-draw", gameId);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new GameHub();
