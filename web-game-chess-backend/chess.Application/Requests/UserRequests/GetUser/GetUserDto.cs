
namespace chess.Application.Requests.UserRequests.GetUser;
#pragma warning disable CS8618

public class GetUserDto {
    public string Email { get; set; }
    public string UserName { get; set; }
    public string? ImageUrl { get; set; }
}
