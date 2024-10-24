
namespace chess.Application.Requests.GameRequests.AcceptRematch;

/// <summary>
/// Dto for notifying correct users
/// </summary>
public class AcceptRematchDto {

    /// <summary>
    /// White user id
    /// </summary>
    public Guid WhitePlayerUserId { get; set; }

    /// <summary>
    /// Black user id
    /// </summary>
    public Guid BlackPlayerUserId { get; set; }
}
