﻿
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class GetTypeHistoryModel : PagedRequest {
    public required TimingTypes Type { get; set; }
}
