
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;

public class GetAllEngineGameMessagesRequest : IRequest<List<GetAllEngineGameMessagesDto>> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
