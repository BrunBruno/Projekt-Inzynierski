
namespace chess.Application.Hubs; 

/// <summary>
/// SignalR game related actions
/// </summary>
public interface IGameHub {

    /// <summary>
    /// Starts when user begins searching for a game
    /// </summary>
    /// <returns></returns>
    Task PlayerJoined();

    /// <summary>
    /// Starts when user stops searching for a game
    /// </summary>
    /// <returns></returns>
    Task PlayerLeaved();

    /// <summary>
    /// To notify about created games 
    /// </summary>
    /// <returns></returns>
    Task GamesChanged();
}
