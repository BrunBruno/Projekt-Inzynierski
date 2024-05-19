
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

public class GetFinishedGamesRequest : IRequest<PagedResult<GetFinishedGamesDto>> {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
