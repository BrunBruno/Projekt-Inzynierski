using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.StartGames;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;

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

    ///<inheritdoc/>
    public async Task GameStarted(Guid gameId) {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }

    ///<inheritdoc/>
    public async Task MakeMove(Guid gameId, string position) {

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = position,
        };

        await _mediator.Send(request);


        await Clients.Groups($"game-{gameId}").GameChanged();
    }
}
