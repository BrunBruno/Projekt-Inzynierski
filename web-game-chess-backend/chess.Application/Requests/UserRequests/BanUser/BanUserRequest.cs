
using MediatR;

namespace chess.Application.Requests.UserRequests.BanUser;

/// <summary>
/// Request for bannin users
/// </summary>
public class BanUserRequest : IRequest {

    /// <summary>
    /// User email address
    /// </summary>
    public required string UserEmail { get; set; }

    /// <summary>
    /// Reason for adding to black list
    /// </summary>
    public required string Reason { get; set; }

    /// <summary>
    /// Ban last for ever or temporarly
    /// </summary>
    public bool IsForEver { get; set; }

    /// <summary>
    /// Durantion for not permament bans
    /// </summary>
    public TimeSpan? Duration { get; set; }
}
