
using chess.Core.Models;

namespace chess.Application.Requests.WebGameRequests.InvitedToGame;

/// <summary>
/// Data returned to invited user
/// </summary>
public class InvitedToGameDto : TimingTypeModel {

    /// <summary>
    /// Created game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Invitee id
    /// </summary>
    public Guid InviteeId { get; set; }

    /// <summary>
    /// Inviter id
    /// </summary>
    public Guid InviterId { get; set; }

    /// <summary>
    /// Inviter username
    /// </summary>
    public required string Inviter { get; set; }
}
