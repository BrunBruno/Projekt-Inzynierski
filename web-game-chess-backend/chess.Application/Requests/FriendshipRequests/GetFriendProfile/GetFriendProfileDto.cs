
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

public class GetFriendProfileDto {
    public required string Username { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public string? Bio { get; set; }
    public required string Country { get; set; }
    public DateTime JoinDate { get; set; }
    public DateTime? FriendsSince { get; set; }


    public int RequestorWins { get; set; } 
    public int RequestorLoses { get; set; }
    public int RequestorDraws { get; set; }
    public int GamesPlayedTogether { get; set; }
    public int GamesPlayed { get; set; }

    public required EloDto Elo { get; set; }
}
