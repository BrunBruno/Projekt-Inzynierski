
using MediatR;

namespace chess.Application.Requests.UserRequests.CheckIfEmailExists;

/// <summary>
/// Gets basic user data by previded email
/// </summary>
public class GetByEmailRequest : IRequest<GetByEmailDto> {

    /// <summary>
    /// Provided email
    /// </summary>
    public string? Email { get; set; }
}
