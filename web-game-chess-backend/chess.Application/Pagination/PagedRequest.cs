
namespace chess.Application.Pagination;

/// <summary>
/// General class for pagination requests and models
/// </summary>
public abstract class PagedRequest {

    /// <summary>
    /// Page number to returen
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Size of one page
    /// </summary>
    public int PageSize { get; set; }
}
