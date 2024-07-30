
using chess.Application.Requests.Abstraction;

namespace chess.Api.Models.GameModels;

public class CreateRematchGameModel : TimingType {
    public Guid OpponentId { get; set; }
}
