
using chess.Api.Binders.NullableBooleanList;
using chess.Core.Enums;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Models.GameModels;

public class GetFinishedGamesModel {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public List<TimingTypes>? TimingTypeFilters { get; set; }

    [ModelBinder(BinderType = typeof(NullableBooleanListBinder))]
    public List<bool?>? ResultFilters { get; set; }
}
