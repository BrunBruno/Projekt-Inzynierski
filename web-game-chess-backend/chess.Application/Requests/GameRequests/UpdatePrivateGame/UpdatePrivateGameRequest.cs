
using MediatR;

namespace chess.Application.Requests.GameRequests.UpdatePrivateGame;

public class UpdatePrivateGameRequest : IRequest<UpdatePrivateGameDto> {

    public Guid GameId { get; set; }
}
