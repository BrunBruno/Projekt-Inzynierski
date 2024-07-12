
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameByEmail;

public class CreateGameByEmailRequest : IRequest<CreateGameByEmailDto> {
    public required string Email { get; set; }
    public TimingTypes Type { get; set; }
    public int Minutes { get; set; }
    public int Increment { get; set; }
}
