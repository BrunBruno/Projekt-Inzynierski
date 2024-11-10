
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreateWebGameByEmailModel : TimingTypeModel {
    public required string Email { get; set; }
}
