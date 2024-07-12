using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Requests.GameRequests.InvitedToGame;

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
    /// Returns to all users in game group end game dto
    /// </summary>
    /// <param name="dto"></param>
    /// <returns></returns>
    Task GameEnded(EndGameDto dto);

    /// <summary>
    /// To get game invitation
    /// </summary>
    /// <param name="gameId"></param>
    /// <param name="username"></param>
    /// <returns></returns>
    Task InvitedToGame(InvitedToGameDto dto);

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task GameAccepted(Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task MessagesUpdated();
}
