
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class CreatePrivateGameModel {
    public Guid FriendshipId { get; set; }
    public TimingTypes Type { get; set; }
    public int Minutes { get; set; }
    public int Increment { get; set; }
}
