
using MediatR;

namespace chess.Application.Requests.UserRequests.Register;

/// <summary>
/// Request for user register
/// </summary>
public class RegisterUserRequest : IRequest {

    /// <summary>
    /// Email address
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Password
    /// </summary>
    public required string Password { get; set; }

    /// <summary>
    /// Password confirmation
    /// </summary>
    public required string ConfirmPassword { get; set; }
}