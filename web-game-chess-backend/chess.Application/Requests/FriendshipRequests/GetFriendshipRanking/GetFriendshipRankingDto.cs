
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;

public class GetFriendshipRankingDto {

    public int Position { get; set; }
    public required string Username { get; set; }
    public int Elo { get; set; }
    public int GamesPlayed { get; set; }
    public required string Ratio { get; set; }
    public bool IsUser { get; set; }
    public ImageDto? Profile { get; set; }
}
