
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetTotalGamesStats;

/// <summary>
/// Request for getting global stats
/// </summary>
public class GetTotalGamesStatsRequest : IRequest<GetTotalGamesStatsDto> {
}
