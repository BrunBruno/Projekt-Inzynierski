
using chess.Core.Abstraction;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

/// <summary>
/// Request for creating game with url 
/// </summary>
public class CreateGameWithLinkRequest : TimingType, IRequest<CreateGameWithLinkDto> {
}
