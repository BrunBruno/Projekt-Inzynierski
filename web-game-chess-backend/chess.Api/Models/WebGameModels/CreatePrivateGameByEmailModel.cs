﻿
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreatePrivateGameByEmailModel : TimingTypeModel {
    public required string Email { get; set; }
}
