
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Player {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Elo { get; set;  }
    public Colors? Color { get; set; } = null;
    public bool IsPlaying { get; set; } = false;


    public Guid UserId { get; set; }
    public User User {  get; set; } 

    public Guid GameId { get; set; }
    public Game WhiteGame { get; set; }
    public Game BlackGame { get; set; }

    public Guid TimingId { get; set; }
}
