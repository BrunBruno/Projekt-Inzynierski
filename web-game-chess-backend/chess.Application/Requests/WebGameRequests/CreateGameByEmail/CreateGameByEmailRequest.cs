
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreateGameByEmail;

/// <summary>
/// Request to create new private game
/// Select opponent by providing email address by current user
/// </summary>
public class CreateGameByEmailRequest : TimingTypeModel, IRequest<CreateGameByEmailDto> {

    /// <summary>
    /// Friend email
    /// </summary>
    public required string Email { get; set; }
}
