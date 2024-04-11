
using MediatR;

namespace chess.Application.Requests.UserRequests.LogIn; 

public class LogInUserRequest : IRequest<LogInUserDto> {
    public required string Email { get; set; }
    public required string Password { get; set; }
}
