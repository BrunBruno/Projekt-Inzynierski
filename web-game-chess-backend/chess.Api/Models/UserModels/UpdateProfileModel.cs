﻿
namespace chess.Api.Models.UserModels;

public class UpdateProfileModel {
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
}
