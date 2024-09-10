
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllMessages;

/// <summary>
/// Request to get all messages for provided game
/// </summary>
public class GetAllMessagesRequest : IRequest<List<GetAllMessagesDto>> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
