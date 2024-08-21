
using chess.Core.Abstraction;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

public class CreateGameWithLinkRequest : TimingType, IRequest<CreateGameWithLinkDto> {
}
