
using chess.Core.Abstraction;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateRematchGame;

/// <summary>
/// Request to create new game, but with same opponent
/// </summary>
public class CreateRematchGameRequest : TimingType, IRequest<CreateRematchGameDto> {

    /// <summary>
    /// Previous opponent id
    /// </summary>
    public Guid OpponentId { get; set; }
}
