
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

public class CreatePrivateGameRequest : IRequest<CreatePrivateGameDto> {

    /// <summary>
    /// Id of frienship between user and selected friend
    /// </summary>
    public Guid FriendshipId { get; set; }

    /// <summary>
    /// Type of timing
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Duration for all moves for one player
    /// </summary>
    public int Minutes { get; set; }

    /// <summary>
    /// Increment for every done move
    /// </summary>
    public int Increment { get; set; }
}
