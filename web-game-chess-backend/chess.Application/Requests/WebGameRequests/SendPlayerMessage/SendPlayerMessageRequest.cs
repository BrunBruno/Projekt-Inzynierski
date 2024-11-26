
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendPlayerMessage;

/// <summary>
/// Request to create new messages
/// </summary>
public class SendPlayerMessageRequest : IRequest {

    /// <summary>
    /// Id of current game
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }
}
