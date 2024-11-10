
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreatePrivateWebGameModel : TimingTypeModel {
    public Guid FriendshipId { get; set; }
}
