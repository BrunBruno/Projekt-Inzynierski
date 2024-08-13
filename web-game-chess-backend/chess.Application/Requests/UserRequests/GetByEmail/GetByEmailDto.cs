
namespace chess.Application.Requests.UserRequests.GetByEmail;

/// <summary>
/// Basic user dto
/// </summary>
public class GetByEmailDto {

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// User username
    /// </summary>
    public required string Username { get; set; }
}
