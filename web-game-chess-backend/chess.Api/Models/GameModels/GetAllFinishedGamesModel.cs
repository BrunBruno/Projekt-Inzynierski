
using chess.Api.Binders.NullableBooleanList;
using chess.Application.Pagination;
using chess.Core.Enums;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Models.GameModels;

public class GetAllFinishedGamesModel : PagedRequest {
    public List<TimingTypes>? TimingTypeFilters { get; set; }

    [ModelBinder(BinderType = typeof(NullableBooleanListBinder))]
    public List<bool?>? ResultFilters { get; set; }
}
