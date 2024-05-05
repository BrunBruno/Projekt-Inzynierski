
using MediatR;

namespace chess.Application.Requests.UserRequests.LogIn; 

/// <summary>
/// Request for geting jwt token
/// </summary>
public class LogInUserRequest : IRequest<LogInUserDto> {

    /// <summary>
    /// Email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Password
    /// </summary>
    public required string Password { get; set; }
}
