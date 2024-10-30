
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CheckIfUpdateRequired;

/// <summary>
/// Request for checking if update on private game created with link is necessary
/// Returns game timing for obtained game
/// </summary>
public class CheckIfUpdateRequiredRequest : IRequest<CheckIfUpdateRequiredDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
