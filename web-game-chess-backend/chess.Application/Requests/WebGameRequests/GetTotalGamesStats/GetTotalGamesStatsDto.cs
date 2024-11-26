
namespace chess.Application.Requests.WebGameRequests.GetTotalGamesStats;

/// <summary>
/// Global stats dto
/// </summary>
public class GetTotalGamesStatsDto {

    /// <summary>
    /// Total games played in current day
    /// </summary>
    public int GamesPlayed {  get; set; }

    /// <summary>
    /// Total users joined in current day
    /// </summary>
    public int UsersJoined { get; set; }
}
