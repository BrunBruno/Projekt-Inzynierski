
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

/// <summary>
/// Request for getting all finished games for user
/// </summary>
public class GetFinishedGamesRequest : IRequest<PagedResult<GetFinishedGamesDto>> {

    /// <summary>
    /// Page number for pagination
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Page size for pagination
    /// </summary>
    public int PageSize { get; set; }
}
