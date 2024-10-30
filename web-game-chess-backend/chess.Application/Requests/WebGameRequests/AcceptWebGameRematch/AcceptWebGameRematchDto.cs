
namespace chess.Application.Requests.WebGameRequests.AcceptWebGameRematch;

/// <summary>
/// Dto for notifying correct users
/// </summary>
public class AcceptWebGameRematchDto {

    /// <summary>
    /// White user id
    /// </summary>
    public Guid WhitePlayerUserId { get; set; }

    /// <summary>
    /// Black user id
    /// </summary>
    public Guid BlackPlayerUserId { get; set; }
}
