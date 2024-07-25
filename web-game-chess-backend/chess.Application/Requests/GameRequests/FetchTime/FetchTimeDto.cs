
namespace chess.Application.Requests.GameRequests.FetchTime;

/// <summary>
/// Times dto
/// </summary>
public class FetchTimeDto {

    /// <summary>
    /// Time left for white
    /// </summary>
    public double WhiteTimeLeft { get; set; }

    /// <summary>
    /// Time left for black
    /// </summary>
    public double BlackTimeLeft { get; set; }
}
