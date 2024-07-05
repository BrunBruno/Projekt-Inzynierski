
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetTypeHistory;

public class GetTypeHistoryRequest : PagedRequest, IRequest<PagedResult<GetTypeHistoryDto>> {
    public TimingTypes Type { get; set; }
}
