
namespace chess.Application.Requests.UserRequests.GetOtherUser;

public class GetOtherUserDto {
    public required string Username { get; set; }
    public string? Name { get; set; }
    public DateTime JoinDate { get; set; }
    public string? ImageUrl { get; set; }
    public required string Country { get; set; }
    public string? Bio { get; set; }
    public int GamesPlayed { get; set; }
}
