
using chess.Core.Abstraction;

namespace chess.Api.Models.GameModels;

public class CreatePrivateGameModel : TimingType {
    public Guid FriendshipId { get; set; }
}
