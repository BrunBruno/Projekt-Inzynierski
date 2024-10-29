
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreateRematchGameModel : TimingTypeModel {
    public Guid PreviousGameId { get; set; }
    public Guid OpponentId { get; set; }
}
