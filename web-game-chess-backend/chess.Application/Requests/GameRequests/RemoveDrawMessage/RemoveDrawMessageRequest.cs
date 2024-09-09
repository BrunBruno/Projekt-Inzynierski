
using MediatR;

namespace chess.Application.Requests.GameRequests.RemoveDrawMessage;

/// <summary>
/// Request for canceling draw offers
/// </summary>
public class RemoveDrawMessageRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
