
using chess.Core.Abstraction;

namespace chess.Api.Models.GameModels;

public class CreateRematchGameModel : TimingType {
    public Guid PreviousGameId { get; set; }
    public Guid OpponentId { get; set; }
}
