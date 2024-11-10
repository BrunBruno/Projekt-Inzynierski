
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetTypeHistory;

/// <summary>
/// Request to get past data for selected timing type
/// </summary>
public class GetTypeHistoryRequest : PagedRequest, IRequest<PagedResult<GetTypeHistoryDto>> {

    /// <summary>
    /// Selected timing type
    /// </summary>
    public TimingTypes Type { get; set; }
}
