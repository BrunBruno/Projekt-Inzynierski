
namespace chess.Application.Requests.UserRequests.GetElo;

public class GetEloDto {
    public int Bullet { get; set; } 
    public int Blitz { get; set; } 
    public int Rapid { get; set; }
    public int Classic { get; set; } 
    public int Daily { get; set; }
}
