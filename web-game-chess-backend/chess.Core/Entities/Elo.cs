
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Elo {
    public Guid Id { get; set; }

    public int Bullet { get; set; } = 1000;

    public int Blitz {  get; set; } = 1000;

    public int Rapid { get; set; } = 1000;

    public int Classic { get; set; } = 1000;

    public int Daily { get; set; } = 1000;

    public Guid UserId { get; set; }
    public User User { get; set; }
}
