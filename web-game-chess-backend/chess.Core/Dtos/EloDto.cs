
namespace chess.Core.Dtos;

/// <summary>
/// General elo dto
/// Representing points for each timing type
/// </summary>
public class EloDto {
    public int Bullet { get; set; }
    public int Blitz { get; set; } 
    public int Rapid { get; set; } 
    public int Classic { get; set; }
    public int Daily { get; set; } 
}
