
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateProfileVisibility; 

/// <summary>
/// Request for update profile visibility
/// </summary>
public class UpdateProfileVisibilityRequest : IRequest {

    /// <summary>
    /// Flag to set profile visibility
    /// </summary>
    public bool ProfileIsPrivate { get; set; }
}
