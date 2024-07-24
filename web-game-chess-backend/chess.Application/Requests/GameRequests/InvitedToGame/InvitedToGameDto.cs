
using chess.Application.Requests.Abstraction;

namespace chess.Application.Requests.GameRequests.InvitedToGame;

/// <summary>
/// Data returnet to invited user
/// </summary>
public class InvitedToGameDto : TimingType
{

    /// <summary>
    /// Created game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Invetee id
    /// </summary>
    public Guid InviteeId { get; set; }

    /// <summary>
    /// Invitor id
    /// </summary>
    public Guid InviterId { get; set; }

    /// <summary>
    /// Invitre username
    /// </summary>
    public required string Inviter { get; set; }
}
