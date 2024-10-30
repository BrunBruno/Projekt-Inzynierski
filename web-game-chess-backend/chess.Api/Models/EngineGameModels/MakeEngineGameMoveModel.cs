
namespace chess.Api.Models.EngineGameModels;

public class MakeEngineGameMoveModel {
    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string Move { get; set; }
}
