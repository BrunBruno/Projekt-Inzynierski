
namespace chess.Application.Hubs; 

/// <summary>
/// SignalR game related actions
/// </summary>
public interface IGameHub {

    /// <summary>
    /// Starts when user begins searching for a game
    /// </summary>
    /// <returns></returns>
    Task PlayerJoined(Guid typeId);

    /// <summary>
    /// Starts when user stops searching for a game
    /// </summary>
    /// <returns></returns>
    Task PlayerLeaved(Guid typeId);

    /// <summary>
    /// To notify about created games 
    /// </summary>
    /// <returns></returns>
    Task GamesChanged();

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task GameStarted(Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task MakeMove(Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task GameChanged();
}
