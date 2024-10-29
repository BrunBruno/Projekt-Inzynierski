
using chess.Application.Pagination;

namespace chess.Api.Models.WebGameModels;

public class GetAllInvitationsModel : PagedRequest {
    public List<bool>? ExpirationFilters { get; set; }
}
