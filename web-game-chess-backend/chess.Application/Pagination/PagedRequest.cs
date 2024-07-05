
namespace chess.Application.Pagination;

public abstract class PagedRequest {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
