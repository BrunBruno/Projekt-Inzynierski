
using MediatR;

namespace chess.Application.Requests.UserRequests.LogInUser; 

/// <summary>
/// Request for getting jwt token
/// </summary>
public class LogInUserRequest : IRequest<LogInUserDto> {

    /// <summary>
    /// Email or username
    /// </summary>
    public required string EmailOrUsername { get; set; }

    /// <summary>
    /// Password
    /// </summary>
    public required string Password { get; set; }
}
