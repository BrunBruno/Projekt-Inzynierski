
using chess.Core.Abstraction;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameByEmail;

/// <summary>
/// Request to create new private game
/// Select opponent by provideing email address by current user
/// </summary>
public class CreateGameByEmailRequest : TimingType, IRequest<CreateGameByEmailDto> {

    /// <summary>
    /// Friend email
    /// </summary>
    public required string Email { get; set; }
}
