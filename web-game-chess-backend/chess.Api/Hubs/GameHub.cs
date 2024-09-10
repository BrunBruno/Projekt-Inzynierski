
using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Hubs;
using chess.Application.Requests.GameRequests.AcceptInvitation;
using chess.Application.Requests.GameRequests.DeclineInvitation;
using chess.Application.Requests.GameRequests.EndGame;
using chess.Application.Requests.GameRequests.InvitedToGame;
using chess.Application.Requests.GameRequests.MakeMove;
using chess.Application.Requests.GameRequests.RemoveDrawMessage;
using chess.Application.Requests.GameRequests.SendDrawMessage;
using chess.Application.Requests.GameRequests.SendMessage;
using chess.Application.Requests.GameRequests.StartGames;
using chess.Application.Requests.GameRequests.UpdatePrivateGame;
using chess.Application.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;
using SignalRSwaggerGen.Enums;

namespace chess.Api.Hubs;

[SignalRHub]
public class GameHub : Hub<IGameHub> {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private readonly IUserContextService _userContextService;

    public GameHub(IMediator mediator, IMapper mapper, IUserContextService userContextService) {
        _mediator = mediator;
        _mapper = mapper;
        _userContextService = userContextService;
    }


    /// <summary>
    /// To be able to get notification from user friends
    /// </summary>
    /// <returns></returns>
    [HubMethodName("add-self-notification")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("AddSelfNotification", Operation.Post)]
    public async Task AddSelfNotification() {

        var userId = _userContextService.GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }


    /// <summary>
    /// Adds user to queue for each timing
    /// Starts all games, that meet requirement for start
    /// Calls to all groups, to check if awaiting players are not in game.
    /// </summary>
    /// <param name="typeId"> Game timing id </param>
    /// <returns></returns>
    [HubMethodName("player-joined")]
    [Authorize(Policy = "IsVerified")]
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
    /// Creates moves
    /// Updates game state
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("make-move")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("MakeMove", Operation.Post)]
    public async Task MakeMove(MakeMoveModel model) {

        var request = _mapper.Map<MakeMoveRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameUpdated();
    }


    /// <summary>
    /// Creates new message for current users and current game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("send-message")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("SendMessage", Operation.Post)]
    public async Task SendMessage(SendMessageModel model) {

        var request = _mapper.Map<SendMessageRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").MessagesUpdated();
    }


    /// <summary>
    /// To send draw offer
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HubMethodName("send-draw")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("SendDraw", Operation.Post)]
    public async Task SendDrawMessage(Guid gameId) {

        var request = new SendDrawMessageRequest() 
        { 
            GameId = gameId,
        };

        await _mediator.Send(request);

        await Clients.Groups($"game-{gameId}").MessagesUpdated();
    }


    /// <summary>
    /// Changes all necessary parameters to end the game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("end-game")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("EndGame", Operation.Put)]
    public async Task EndGame(EndGameModel model) {

        var request = _mapper.Map<EndGameRequest>(model);

        var endGameDto = await _mediator.Send(request);

        await Clients.Groups($"game-{model.GameId}").GameEnded(endGameDto);
    }


    /// <summary>
    /// Adds user to 2-user groups to perform game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HubMethodName("add-player")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("AddPlayer", Operation.Put)]
    public async Task AddPlayer(Guid gameId) {

        await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }


    /// <summary>
    ///  To accept new received invitation
    ///  Notify both counterparts and starts the game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("accept-invitation")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("AcceptInvitation", Operation.Put)]

    public async Task AcceptInvitation(AcceptInvitationModel model) {

        var request = _mapper.Map<AcceptInvitationRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"user-{model.InviterId}").GameAccepted(model.GameId);
        await Clients.Groups($"user-{model.InviteeId}").GameAccepted(model.GameId);
    }


    /// <summary>
    /// Updates game created with link
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("update-private-game")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("UpdatePrivateGame", Operation.Put)]
    public async Task UpdatePrivateGame(Guid gameId) {

        var request = new UpdatePrivateGameRequest()
        {
            GameId = gameId,
        };

        var startGameDto = await _mediator.Send(request);

        if (startGameDto.ShouldStart) {
            await Clients.Groups($"user-{startGameDto.WhitePlayerUserId}").GameAccepted(gameId);
            await Clients.Groups($"user-{startGameDto.BlackPlayerUserId}").GameAccepted(gameId);
        }
    }


    /// <summary>
    /// Provides invited user with essential data to accept newly created game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HubMethodName("notify-user")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("NotifyUser", Operation.Get)]
    public async Task NotifyUser(NotifyUserModel model) {

        var inviterId = _userContextService.GetUserId();

        var invitationDto = new InvitedToGameDto()
        {
            GameId = model.GameId,
            InviteeId = model.FriendId,
            InviterId = inviterId,
            Inviter = model.Inviter,
            Type = model.Type,
            Minutes = model.Minutes,
            Increment = model.Increment,
        };

        await Clients.Groups($"user-{model.FriendId}").InvitedToGame(invitationDto);
    }


    /// <summary>
    /// Removes player from queue.
    /// Should start also with 'abort' in game controller.
    /// </summary>
    /// <param name="typeId"> Game timing id </param>
    /// <returns></returns>
    [HubMethodName("player-leaved")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("PlayerLeaved", Operation.Delete)]
    public async Task PlayerLeaved(Guid typeId) {

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"queue-{typeId}");
    }


    /// <summary>
    /// Removes user from game connection
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HubMethodName("leave-game")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("LeaveGame", Operation.Delete)]
    public async Task LeaveGame(Guid gameId) {

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"game-{gameId}");
    }


    /// <summary>
    /// To decline invitations and notify inviter
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HubMethodName("decline-invitation")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("DeclineInvitation", Operation.Delete)]
    public async Task DeclineInvitation(DeclineInvitationModel model) {

        var request = _mapper.Map<DeclineInvitationRequest>(model);

        await _mediator.Send(request);

        await Clients.Groups($"user-{model.FriendId}").InvitationDeclined();
    }


    /// <summary>
    /// To decline a draw
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HubMethodName("remove-draw")]
    [Authorize(Policy = "IsVerified")]
    [SignalRMethod("RemoveDraw", Operation.Delete)]
    public async Task RemoveDrawMessage(Guid gameId) {

        var request = new RemoveDrawMessageRequest()
        {
            GameId = gameId,
        };

        await _mediator.Send(request);

        await Clients.Groups($"game-{gameId}").MessagesUpdated();
    }
}
