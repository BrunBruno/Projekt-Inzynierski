
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class CreatePrivateGameModel : TimingTypeModel {
    public Guid FriendshipId { get; set; }
}
