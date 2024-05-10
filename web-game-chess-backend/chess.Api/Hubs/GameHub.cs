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
    public async Task PlayerJoined(Guid typeId) {

        await Groups.AddToGroupAsync(Context.ConnectionId, $"queue-{typeId}");

        var request = new StartGamesRequest() 
        { 
            TimingId = typeId,
        };

        await _mediator.Send(request);

        await Clients.Groups($"queue-{typeId}").GamesChanged();
    }

    ///<inheritdoc/>
    public async Task PlayerLeaved(Guid typeId) {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-{typeId}");
    }
}
