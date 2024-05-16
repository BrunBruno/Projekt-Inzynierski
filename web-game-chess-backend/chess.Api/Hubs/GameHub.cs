
using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.StartGames;
using MediatR;
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

    [SignalRMethod("PlayerLeaved", Operation.Delete)]
    public async Task PlayerLeaved(Guid typeId) {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-{typeId}");
    }

    [SignalRMethod("GameStarted", Operation.Patch)]
    public async Task GameStarted(Guid gameId) {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }

    [SignalRMethod("MakeMove", Operation.Post)]
    public async Task MakeMove(Guid gameId, string position, string move, string newCoor, string oldCoor, string? enPassant, bool wkm, bool wsrm, bool wlrm, bool bkm, bool bsrm, bool blrm) {

        var request = new MakeMoveRequest()
        {
            GameId = gameId,
            Position = position,
            DoneMove = move,
            OldCoor = oldCoor,
            NewCoor = newCoor,
            EnPassant = enPassant,
            WhiteKingMoved = wkm,
            WhiteShortRookMoved = wsrm,
            WhiteLongRookMoved = wlrm,
            BlackKingMoved = bkm,
            BlackShortRookMoved = bsrm,
            BlackLongRookMoved = blrm,
        };

        await _mediator.Send(request);


        await Clients.Groups($"game-{gameId}").GameUpdated();
    }
}
