
using MediatR;

namespace chess.Application.Requests.UserRequests.GetOtherUser;

/// <summary>
/// Request to get data about not current user
/// </summary>
public class GetOtherUserRequest : IRequest<GetOtherUserDto> {

    /// <summary>
    /// Provided userId to get other user
    /// </summary>
    public Guid UserId { get; set; }
}
