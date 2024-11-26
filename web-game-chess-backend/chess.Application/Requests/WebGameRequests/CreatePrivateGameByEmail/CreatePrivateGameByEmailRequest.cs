
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreatePrivateGameByEmail;

/// <summary>
/// Request to create new private game
/// Select opponent by providing email address by current user
/// </summary>
public class CreatePrivateGameByEmailRequest : TimingTypeModel, IRequest<CreatePrivateGameByEmailDto> {

    /// <summary>
    /// Friend email
    /// </summary>
    public required string Email { get; set; }
}
