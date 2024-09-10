
using MediatR;

namespace chess.Application.Requests.UserRequests.GetByEmail;

/// <summary>
/// Gets basic user data by provided email
/// </summary>
public class GetByEmailRequest : IRequest<GetByEmailDto> {

    /// <summary>
    /// Provided email
    /// </summary>
    public string? Email { get; set; }
}
