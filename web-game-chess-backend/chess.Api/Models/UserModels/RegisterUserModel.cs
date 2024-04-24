﻿
namespace chess.Api.Models.UserModels;

public class RegisterUserModel {
    public required string Email { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
}
