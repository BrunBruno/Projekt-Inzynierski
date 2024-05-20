
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class EndGameModel {
    public Guid GameId { get; set; }
    public Colors? LoserColor { get; set; }
    public EndGameTypes EndGameType { get; set; }

}
