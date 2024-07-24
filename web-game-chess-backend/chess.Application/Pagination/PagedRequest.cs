
namespace chess.Application.Pagination;

/// <summary>
/// General class for pagination requests and models
/// </summary>
public abstract class PagedRequest {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
