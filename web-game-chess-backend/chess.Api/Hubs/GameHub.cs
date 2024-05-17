
using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.StartGames;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;
using SignalRSwaggerGen.Enums;
using System;

namespace chess.Api.Hubs;

[SignalRHub]
public class GameHub : Hub<IGameHub> {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public GameHub(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
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
    public async Task MakeMove(MakeMoveModel model) {

        var request = _mapper.Map<MakeMoveRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameUpdated();
    }


    [SignalRMethod("EndGame", Operation.Post)]
    public async Task EndGame(EndGameModel model) {

        var request = _mapper.Map<EndGameRequest>(model);

        var endGameDto = await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameEnded(endGameDto);
    }


    [SignalRMethod("LeaveGame", Operation.Delete)]
    public async Task LeaveGame(Guid gameId) {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }
}
