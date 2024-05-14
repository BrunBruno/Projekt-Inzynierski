
using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.StartGames;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;
using SignalRSwaggerGen.Enums;

namespace chess.Api.Hubs;

[SignalRHub]
public class GameHub : Hub<IGameHub> {

    private readonly IMediator _mediator;

    public GameHub(IMediator mediator) {
        _mediator = mediator;
    }

    ///<inheritdoc/>
    [SignalRMethod("PlayerJoined", Operation.Post)]
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
    [SignalRMethod("PlayerLeaved", Operation.Delete)]
    public async Task PlayerLeaved(Guid typeId) {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-{typeId}");
    }

    ///<inheritdoc/>
    [SignalRMethod("GameStarted", Operation.Patch)]
    public async Task GameStarted(Guid gameId) {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }

    ///<inheritdoc/>
    [SignalRMethod("MakeMove", Operation.Post)]
    public async Task MakeMove(Guid gameId, string position, string move) {

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = position,
            DoneMove = move,
        };

        await _mediator.Send(request);


        await Clients.Groups($"game-{gameId}").GameUpdated();
    }
}
