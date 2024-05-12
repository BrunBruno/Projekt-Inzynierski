
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame; 

/// <summary>
/// 
/// </summary>
public class GetGameRequest : IRequest<GetGameDto> {

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }
}
