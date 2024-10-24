
using chess.Application.Pagination;

namespace chess.Api.Models.GameModels;

public class GetAllInvitationsModel : PagedRequest {
    public List<bool>? ExpirationFilters { get; set; }
}
