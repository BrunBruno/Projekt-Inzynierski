﻿
namespace chess.Application.Pagination;
#pragma warning disable CS8618 

/// <summary>
/// General class for pagination results
/// </summary>
/// <typeparam name="T"></typeparam>
public class PagedResult<T> where T : class {
    public List<T> Items { get; set; }
    public int TotalPages { get; set; }
    public int ItemsFrom { get; set; }
    public int ItemsTo { get; set; }
    public int TotalItemsCount { get; set; }

    /// <summary>
    /// Needed for deserialization in tests.
    /// </summary>
    public PagedResult() {}

    public PagedResult(List<T> items, int totalCount, int pageSize, int pageNumber) {
        Items = items
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .ToList();

        TotalItemsCount = totalCount;

        ItemsFrom = pageSize * (pageNumber - 1) + 1;

        int itemsTo = pageSize * (pageNumber - 1) + pageSize;
        ItemsTo = itemsTo > totalCount ? totalCount : itemsTo;

        TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}