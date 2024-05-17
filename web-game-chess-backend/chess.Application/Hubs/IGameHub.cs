
using chess.Application.Requests.GameRequests.EndGame;
using chess.Core.Enums;

namespace chess.Application.Hubs; 

/// <summary>
/// SignalR game related actions
/// </summary>
public interface IGameHub {

    /// <summary>
    /// To notify about created games 
    /// </summary>
    /// <returns></returns>
    Task GamesChanged();

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task GameUpdated();

    Task GameEnded(EndGameDto endGameDto);
}
