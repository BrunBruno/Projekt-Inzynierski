﻿
using chess.Application.Requests.WebGameRequests.CreateWebGameRematch;
using chess.Application.Requests.WebGameRequests.GetWebGameWinner;
using chess.Application.Requests.WebGameRequests.InvitedToGame;

namespace chess.Application.Hubs;

/// <summary>
/// SignalR game related actions
/// </summary>
public interface IGameHub {

    /// <summary>
    /// To notify queue group about created games 
    /// </summary>
    /// <returns></returns>
    Task GamesChanged();

    /// <summary>
    /// Informs all user in game group, when move has been made
    /// </summary>
    /// <returns></returns>
    Task GameUpdated();

    /// <summary>
    /// To notify about game end
    /// </summary>
    /// <returns></returns>
    Task GameEnded();

    /// <summary>
    /// To get game invitation
    /// </summary>
    /// <param name="gameId"></param>
    /// <param name="username"></param>
    /// <returns></returns>
    Task InvitedToGame(InvitedToGameDto dto);

    /// <summary>
    /// To notify users that invitation was accepted
    /// </summary>
    /// <returns></returns>
    Task GameAccepted(Guid gameId);

    /// <summary>
    /// To notify users when new message was sent
    /// </summary>
    /// <returns></returns>
    Task MessagesUpdated();

    /// <summary>
    /// To notify about declined invitation
    /// </summary>
    /// <returns></returns>
    Task InvitationDeclined();

    /// <summary>
    /// For show typing animation
    /// </summary>
    /// <param name="IsTyping"></param>
    /// <returns></returns>
    Task TypingStatus(bool IsTyping);

    /// <summary>
    /// For notifying about rematch request offer
    /// </summary>
    /// <param name=""></param>
    /// <returns></returns>
    Task RematchRequested(CreateWebGameRematchDto gameData);

    /// <summary>
    /// For notifying about rematch request cancellation
    /// </summary>
    /// <returns></returns>
    Task RematchCanceled();

    /// <summary>
    /// Task to get winner of ended game
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    Task GetWinner(GetWebGameWinnerDto dto);
}
