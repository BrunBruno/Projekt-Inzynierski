﻿
using MediatR;

namespace chess.Application.Requests.UserRequests.Register;

public class RegisterUserRequest : IRequest {
    public required string Email { get; set; }
    public required string Username { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    public string? ImageUrl { get; set; }
}