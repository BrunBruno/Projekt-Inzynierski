
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;

/// <summary>
/// Request for getting all engine game messages
/// </summary>
public class GetAllEngineGameMessagesRequest : IRequest<List<GetAllEngineGameMessagesDto>> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
