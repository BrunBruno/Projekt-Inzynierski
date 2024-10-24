﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

/// <summary>
/// Checks if current user exists
/// Checks if friendship with provided user exists
/// Checks if provided data is correct
/// Checks if game timing exists and if not creates one
/// Creates players for both current user and provided friend
/// Creates new game and associated game state
/// Creates new invitation for created game
/// Sends invitation to friend email
/// Returns essential for further actions
/// </summary>
public class CreatePrivateGameRequestHandler : IRequestHandler<CreatePrivateGameRequest, CreatePrivateGameDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameStateRepository _gameStateRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IGameInvitationRepository _gameInvitationRepository;
    private readonly ISmtpService _smtpService;

    public CreatePrivateGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository,
        IGameStateRepository gameStateRepository,
        IPlayerRepository playerRepository,
        IFriendshipRepository friendshipRepository,
        IGameInvitationRepository gameInvitationRepository,
        ISmtpService smtpService
        
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _playerRepository = playerRepository;
        _friendshipRepository = friendshipRepository;
        _gameInvitationRepository = gameInvitationRepository;
        _smtpService = smtpService;
    }

    public async Task<CreatePrivateGameDto> Handle(CreatePrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var friendship = await _friendshipRepository.GetById(request.FriendshipId)
               ?? throw new NotFoundException("Friendship not found.");

        if (friendship.Status != FriendshipStatus.Accepted)
            throw new BadRequestException("Friendship not accepted.");

        var friendId = userId == friendship.RequestorId ? friendship.ReceiverId : friendship.RequestorId;

        var friend = await _userRepository.GetById(friendId)
             ?? throw new NotFoundException("Friend not found.");

        var existingGameTiming = await _gameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment);


        var timing = existingGameTiming;
        if (existingGameTiming is null) {

            var gameTiming = new GameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Seconds = request.Minutes * 60,
                Increment = request.Increment,
            };

            await _gameTimingRepository.Create(gameTiming);

            timing = gameTiming;

        }

        int userElo = user.Elo.GetElo(request.Type);
        var userPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = user.Username,
            Elo = userElo,
            TimeLeft = request.Minutes * 60,
            UserId = userId,
            TimingId = timing!.Id,
        };

        int friendElo = friend.Elo.GetElo(request.Type);
        var friendPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = friend.Username,
            Elo = friendElo,
            TimeLeft = request.Minutes * 60,
            UserId = friend.Id,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(userPlayer);
        await _playerRepository.Create(friendPlayer);


        var game = new Game()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing!.Id,

            WhitePlayerRegistered = false,
            BlackPlayerRegistered = false,
        };

        userPlayer.GameId = game.Id;
        friendPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : friendPlayer.Id;
        game.BlackPlayerId = randomChoice ? friendPlayer.Id : userPlayer.Id;

        game.WhitePlayerRegistered = true;
        game.BlackPlayerRegistered = true;

        userPlayer.Color = randomChoice ? PieceColor.White : PieceColor.Black;
        friendPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;

        var gameState = new GameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };

        var invitation = new GameInvitation()
        {
            Id = Guid.NewGuid(),
            InviterId = userId,
            InviterName = user.Username,
            InviteeId = friend.Id,
            InviteeName = friend.Username,
            Type = request.Type,
            GameId = game.Id,
        };


        await _gameRepository.Create(game);
        await _gameStateRepository.Create(gameState);
        await _gameInvitationRepository.Create(invitation);


        var privateGameDto = new CreatePrivateGameDto()
        {
            FriendId = friendId,
            GameId = game.Id,
            Inviter = user.Username,
        };


        await _smtpService.SendGameInvitation(friend.Email.ToLower(), friend.Username, user.Username);


        return privateGameDto;
    }
}
