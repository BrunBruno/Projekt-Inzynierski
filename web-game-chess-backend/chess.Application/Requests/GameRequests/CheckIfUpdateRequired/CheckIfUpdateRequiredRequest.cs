
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfUpdateRequired;

public class CheckIfUpdateRequiredRequest : IRequest<CheckIfUpdateRequiredDto> {

    public Guid GameId { get; set; }
}
