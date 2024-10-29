
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreateGameByEmailModel : TimingTypeModel {
    public required string Email { get; set; }
}
