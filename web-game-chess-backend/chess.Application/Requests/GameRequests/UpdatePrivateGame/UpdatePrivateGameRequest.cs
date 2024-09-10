
using MediatR;

namespace chess.Application.Requests.GameRequests.UpdatePrivateGame;

/// <summary>
/// Request for updating private games created with urls
/// </summary>
public class UpdatePrivateGameRequest : IRequest<UpdatePrivateGameDto> {

    /// <summary>
    /// Game id to update
    /// </summary>
    public Guid GameId { get; set; }
}
