
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateRematchGame;

/// <summary>
/// Checks of provided timing exists
/// Checks if both users exists
/// Creates players for both users
/// Creates new game and game states
/// Returns game id
/// </summary>
public class CreateRematchGameRequestHandler : IRequestHandler<CreateRematchGameRequest, CreateRematchGameDto> {

    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameStateRepository _gameStateRepository;

    public CreateRematchGameRequestHandler(
        IGameTimingRepository gameTimingRepository,
        IGameRepository gameRepository,
        IPlayerRepository playerRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameStateRepository gameStateRepository
    ) {
        _gameTimingRepository = gameTimingRepository;
        _gameRepository = gameRepository;
        _playerRepository = playerRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameStateRepository = gameStateRepository;
    }

    public async Task<CreateRematchGameDto> Handle(CreateRematchGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var timing = await _gameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment) 
            ?? throw new NotFoundException("Timing not found.");

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        var opponent = await _userRepository.GetById(request.OpponentId)
            ?? throw new NotFoundException("Opponent not found.");


        int userElo = user.Elo.GetElo(request.Type);
        var userPlayer = new Player()
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
        var opponentPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = opponent.Username,
            Elo = opponentElo,
            TimeLeft = request.Minutes * 60,
            UserId = opponent.Id,
            TimingId = timing.Id,
        };


        var game = new Game()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing.Id,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
        };


        userPlayer.GameId = game.Id;
        opponentPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : opponentPlayer.Id;
        game.BlackPlayerId = randomChoice ? opponentPlayer.Id : userPlayer.Id;

        userPlayer.Color = randomChoice ? PieceColor.White : PieceColor.Black;
        opponentPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;


        var gameState = new GameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };


        await _playerRepository.Create(userPlayer);

        await _playerRepository.Create(opponentPlayer);

        await _gameRepository.Create(game);

        await _gameStateRepository.Create(gameState);


        var privateGameDto = new CreateRematchGameDto()
        {
            GameId = game.Id,
        };

        return privateGameDto;
    }
}
