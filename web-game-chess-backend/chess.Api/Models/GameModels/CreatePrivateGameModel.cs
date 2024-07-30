
using chess.Application.Requests.Abstraction;

namespace chess.Api.Models.GameModels;

public class CreatePrivateGameModel : TimingType {
    public Guid FriendshipId { get; set; }
}
