
using chess.Core.Enums;

namespace chess.Api.Models.WebGameModels;

public class EndWebGameModel {
    public Guid GameId { get; set; }
    public PieceColor? LoserColor { get; set; }
    public GameEndReason EndGameType { get; set; }

}
