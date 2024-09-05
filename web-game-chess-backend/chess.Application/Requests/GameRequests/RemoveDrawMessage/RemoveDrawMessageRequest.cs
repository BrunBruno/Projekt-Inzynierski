
using MediatR;

namespace chess.Application.Requests.GameRequests.RemoveDrawMessage;

/// <summary>
/// 
/// </summary>
public class RemoveDrawMessageRequest : IRequest {

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }
}
