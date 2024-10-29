
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateRematchGame;

/// <summary>
/// Request to create new game, but with same opponent
/// </summary>
public class CreateRematchGameRequest : TimingTypeModel, IRequest<CreateRematchGameDto> {

    /// <summary>
    /// Previous game id
    /// </summary>
    public Guid PreviousGameId { get; set; }

    /// <summary>
    /// Previous opponent user id
    /// </summary>
    public Guid OpponentId { get; set; }
}
