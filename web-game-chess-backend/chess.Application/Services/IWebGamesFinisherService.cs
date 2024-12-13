
namespace chess.Application.Services;

/// <summary>
/// Worker interface
/// </summary>
public interface IWebGamesFinisherService {

    /// <summary>
    /// To finish all games
    /// </summary>
    /// <returns></returns>
    Task FinishGames();
}
