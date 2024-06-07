
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateRematchGame;

public class CreateRematchGameRequest : IRequest<CreateRematchGameDto> {

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

    /// <summary>
    /// 
    /// </summary>
    public Guid OpponentId { get; set; }
}
