
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

namespace chess.Api.Hubs;

[SignalRHub]
public class GameHub : Hub<IGameHub> {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public GameHub(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Adds user to queue for each timing
    /// Starts all games, that meet requiriment for start
    /// Calls to all grups, to check if awaiting players are not in game.
    /// </summary>
    /// <param name="typeId"> Game timing id </param>
    /// <returns></returns>
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


    /// <summary>
    /// Creats moves
    /// Updates game state
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [SignalRMethod("MakeMove", Operation.Post)]
    public async Task MakeMove(MakeMoveModel model) {

        var request = _mapper.Map<MakeMoveRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameUpdated();
    }


    /// <summary>
    /// Changels all necessary parameters to end the game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [SignalRMethod("EndGame", Operation.Put)]
    public async Task EndGame(EndGameModel model) {

        var request = _mapper.Map<EndGameRequest>(model);

        var endGameDto = await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameEnded(endGameDto);
    }


    /// <summary>
    /// Adds user to 2-user grups to perform game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [SignalRMethod("GameStarted", Operation.Put)]
    public async Task GameStarted(Guid gameId) {

        await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }


    /// <summary>
    /// Removes player from queue.
    /// Should start also with 'abort' in game controller.
    /// </summary>
    /// <param name="typeId"> Game timing id </param>
    /// <returns></returns>
    [SignalRMethod("PlayerLeaved", Operation.Delete)]
    public async Task PlayerLeaved(Guid typeId) {

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-{typeId}");
    }


    /// <summary>
    /// Removes user from game connection
    /// </summary>
    /// <param name="gameId"> Game id </param>
    /// <returns></returns>
    [SignalRMethod("LeaveGame", Operation.Delete)]
    public async Task LeaveGame(Guid gameId) {

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }
}
