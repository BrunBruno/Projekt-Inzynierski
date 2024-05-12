
using MediatR;

namespace chess.Application.Requests.GameRequests.StartGames;

/// <summary>
/// 
/// </summary>
public class StartGamesRequest : IRequest {

    /// <summary>
    /// 
    /// </summary>
    public Guid TimingId { get; set; }
}
