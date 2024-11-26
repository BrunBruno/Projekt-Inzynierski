
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreateWebGameRematch;

/// <summary>
/// Checks of provided timing exists
/// Checks if both users exists
/// Creates players for both users
/// Creates new game and game states
/// Returns game id
/// </summary>
public class CreateWebGameRematchRequestHandler : IRequestHandler<CreateWebGameRematchRequest, CreateWebGameRematchDto> {

    private readonly IWebGameTimingRepository _webGameTimingRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IWebGameStateRepository _gameStateRepository;

    public CreateWebGameRematchRequestHandler(
        IWebGameTimingRepository gameTimingRepository,
        IWebGameRepository gameRepository,
        IWebGamePlayerRepository playerRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameStateRepository gameStateRepository
    ) {
        _webGameTimingRepository = gameTimingRepository;
        _webGameRepository = gameRepository;
        _webGamePlayerRepository = playerRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameStateRepository = gameStateRepository;
    }

    public async Task<CreateWebGameRematchDto> Handle(CreateWebGameRematchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var timing = await _webGameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment) 
            ?? throw new NotFoundException("Timing not found.");

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        var opponent = await _userRepository.GetById(request.OpponentId)
            ?? throw new NotFoundException("Opponent not found.");


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


        int opponentElo = opponent.Elo.GetElo(request.Type);
        var opponentPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = opponent.Username,
            Elo = opponentElo,
            TimeLeft = request.Minutes * 60,
            UserId = opponent.Id,
            TimingId = timing.Id,
        };


        var game = new WebGame()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing.Id,
        };


        userPlayer.GameId = game.Id;
        opponentPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : opponentPlayer.Id;
        game.BlackPlayerId = randomChoice ? opponentPlayer.Id : userPlayer.Id;

        userPlayer.Color = randomChoice ? PieceColor.White : PieceColor.Black;
        opponentPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;


        var gameState = new WebGameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };


        await _webGamePlayerRepository.Create(userPlayer);

        await _webGamePlayerRepository.Create(opponentPlayer);

        await _webGameRepository.Create(game);

        await _gameStateRepository.Create(gameState);


        var privateGameDto = new CreateWebGameRematchDto()
        {
            GameId = game.Id,
            OpponentName = opponent.Username,
        };

        return privateGameDto;
    }
}
