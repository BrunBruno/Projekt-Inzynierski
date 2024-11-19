
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreateWebGameRematch;

/// <summary>
/// Request to create new game, but with same opponent
/// </summary>
public class CreateWebGameRematchRequest : TimingTypeModel, IRequest<CreateWebGameRematchDto> {

    /// <summary>
    /// Previous game id
    /// </summary>
    public Guid PreviousGameId { get; set; }

    /// <summary>
    /// Previous opponent user id
    /// </summary>
    public Guid OpponentId { get; set; }
}
