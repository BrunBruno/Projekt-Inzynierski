
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetAllMessages;

/// <summary>
/// Request to get all messages for provided game
/// </summary>
public class GetAllMessagesRequest : IRequest<List<GetAllWebGameMessagesDto>> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
