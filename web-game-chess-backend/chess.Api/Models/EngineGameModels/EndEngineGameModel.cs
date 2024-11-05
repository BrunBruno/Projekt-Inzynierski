
using chess.Core.Enums;

namespace chess.Api.Models.EngineGameModels;

public class EndEngineGameModel {
    public Guid GameId { get; set; }
    public PieceColor? LoserColor { get; set; }
}
