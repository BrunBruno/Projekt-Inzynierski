
namespace chess.Application.Requests.UserRequests.CheckIfEmailExists;

public class GetByEmailDto {
    public required string Email { get; set; }
    public required string Username { get; set; }
}
