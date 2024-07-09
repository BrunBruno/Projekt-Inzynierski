
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateProfile;

public class UpdateProfileRequest : IRequest {
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
}
