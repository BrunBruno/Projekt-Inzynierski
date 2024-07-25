
using chess.Core.Dtos;

namespace chess.Application.Requests.UserRequests.GetUser;

/// <summary>
/// DTO for user info
/// </summary>
public class GetUserDto : UserDto {

    /// <summary>
    /// Id of user
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }
}
