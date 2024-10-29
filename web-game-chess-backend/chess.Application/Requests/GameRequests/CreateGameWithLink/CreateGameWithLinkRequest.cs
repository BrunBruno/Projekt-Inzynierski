
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

/// <summary>
/// Request for creating game with url 
/// </summary>
public class CreateGameWithLinkRequest : TimingTypeModel, IRequest<CreateGameWithLinkDto> {
}
