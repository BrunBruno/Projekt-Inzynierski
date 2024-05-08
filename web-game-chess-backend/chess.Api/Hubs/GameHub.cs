using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.StartGames;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace chess.Api.Hubs;

public class GameHub : Hub<IGameHub> {

    private readonly IMediator _mediator;

    public GameHub(IMediator mediator) {
        _mediator = mediator;
    }

    ///<inheritdoc/>
    public async Task PlayerJoined() {

        await Groups.AddToGroupAsync(Context.ConnectionId, "queue");

        var request = new StartGamesRequest();

        await _mediator.Send(request);

        await Clients.Groups("queue").GamesChanged();
    }

    ///<inheritdoc/>
    public async Task PlayerLeaved() {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "queue");
    }
}
