
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendWebGameMessage;

/// <summary>
/// Request for sending bot messages
/// </summary>
public class SendWebGameMessageRequest : IRequest {

    /// <summary>
    /// Id of current game
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }
}