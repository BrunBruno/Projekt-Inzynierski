
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateUserData; 

/// <summary>
/// 
/// </summary>
public class UpdateUserDataRequest : IRequest {

    /// <summary>
    /// 
    /// </summary>
    public bool ProfileIsPrivate { get; set; }
}
