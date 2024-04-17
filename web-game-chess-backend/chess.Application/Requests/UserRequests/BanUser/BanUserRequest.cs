
using MediatR;

namespace chess.Application.Requests.UserRequests.BanUser;

public class BanUserRequest : IRequest {
    public string UserEmail { get; set; }
    public string Reason { get; set; }
    public bool IsForEver { get; set; }
    public TimeSpan? Duration { get; set; }
}
