
using MediatR;

namespace chess.Application.Requests.UserRequests.CheckIfEmailExists;

public class GetByEmailRequest : IRequest<GetByEmailDto> {
    public string? Email { get; set; }
}
