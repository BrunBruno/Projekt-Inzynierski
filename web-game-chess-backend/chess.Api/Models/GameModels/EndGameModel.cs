
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class EndGameModel {
    public Guid GameId { get; set; }
    public PieceColor? LoserColor { get; set; }
    public GameEndReason EndGameType { get; set; }

}
