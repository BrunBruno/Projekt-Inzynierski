
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreatePrivateGameWithLink;

/// <summary>
/// Request for creating game with url 
/// </summary>
public class CreatePrivateGameWithLinkRequest : TimingTypeModel, IRequest<CreatePrivateGameWithLinkDto> {
}
