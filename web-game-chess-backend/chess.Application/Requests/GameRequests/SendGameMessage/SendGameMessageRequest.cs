
using MediatR;

namespace chess.Application.Requests.GameRequests.SendGameMessage;

/// <summary>
/// Request for sending bot messages
/// </summary>
public class SendGameMessageRequest : IRequest {

    /// <summary>
    /// Id of current game
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }
}