﻿
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using chess.Core.Maps.MapOfElo;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;

namespace chess.Application.Requests.WebGameRequests.CreatePrivateGameWithLink;

/// <summary>
/// Checks is current user exists
/// Checks is game timing with provided values exists
/// Creates timing if nothing was found
/// Creates player for current user
/// Creates placeholder players for later update
/// Creates game
/// Returns dto with game url
/// </summary>
public class CreatePrivateGameWithLinkRequestHandler : IRequestHandler<CreatePrivateGameWithLinkRequest, CreatePrivateGameWithLinkDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGameTimingRepository _webGameTimingRepository;
    private readonly IWebGameStateRepository _gameStateRepository;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public CreatePrivateGameWithLinkRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameRepository gameRepository,
        IWebGameTimingRepository gameTimingRepository,
        IWebGameStateRepository gameStateRepository,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _webGameRepository = gameRepository;
        _webGameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task<CreatePrivateGameWithLinkDto> Handle(CreatePrivateGameWithLinkRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var existingGameTiming = await _webGameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment);


        var timing = existingGameTiming;
        if (timing is null) {

            var gameTiming = new WebGameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Seconds = request.Minutes * 60,
                Increment = request.Increment,
            };

            await _webGameTimingRepository.Create(gameTiming);

            timing = gameTiming;
        }

        int userElo = user.Elo.GetElo(request.Type);
        var userPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = user.Username,
            Elo = userElo,
            TimeLeft = request.Minutes * 60,
            UserId = userId,
            TimingId = timing.Id,
        };

        var placeholderPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimeLeft = request.Minutes * 60,
            TimingId = timing.Id,

            // update this on start
            IsTemp = true,
            Name = "",
            UserId = userId, // needed for db relation
        };


        await _webGamePlayerRepository.Create(userPlayer);
        await _webGamePlayerRepository.Create(placeholderPlayer);


        var game = new WebGame()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing!.Type,
            GameTimingId = timing!.Id,
        };

        userPlayer.GameId = game.Id;
        placeholderPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : placeholderPlayer.Id;
        game.BlackPlayerId = randomChoice ? placeholderPlayer.Id : userPlayer.Id;

        userPlayer.Color = randomChoice ? PieceColor.White : PieceColor.Black;
        placeholderPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;

        var gameState = new WebGameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };


        await _webGameRepository.Create(game);
        await _gameStateRepository.Create(gameState);


        var privateGameDto = new CreatePrivateGameWithLinkDto()
        {
            GameId = game.Id,
            GameUrl = $"http://localhost:5173/main/await/{game.Id}"
        };


        return privateGameDto;
    }
}
