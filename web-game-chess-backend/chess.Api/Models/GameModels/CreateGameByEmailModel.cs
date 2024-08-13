
using chess.Core.Abstraction;

namespace chess.Api.Models.GameModels;

public class CreateGameByEmailModel : TimingType {
    public required string Email { get; set; }
}
