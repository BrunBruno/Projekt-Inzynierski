
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CheckIfUpdateOnPrivateGameRequired;

/// <summary>
/// Request for checking if update on private game created with link is necessary
/// Returns game timing for obtained game
/// </summary>
public class CheckIfUpdateOnPrivateGameRequiredRequest : IRequest<CheckIfUpdateOnPrivateGameRequiredDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
