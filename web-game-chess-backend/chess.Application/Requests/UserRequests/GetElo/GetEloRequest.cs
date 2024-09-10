
using MediatR;

namespace chess.Application.Requests.UserRequests.GetElo;

/// <summary>
/// Request to get latest elo for current user
/// </summary>
public class GetEloRequest : IRequest<GetEloDto> {
}
