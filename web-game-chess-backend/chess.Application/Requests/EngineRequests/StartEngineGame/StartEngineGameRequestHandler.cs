
using chess.Application.Repositories;
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.StartEngineGame;

/// <summary>
/// Checks if user exists
/// Creates player, game and starting message
/// Returns game id
/// </summary>
public class StartEngineGameRequestHandler : IRequestHandler<StartEngineGameRequest, StartEngineGameDto> {

    private readonly Random _random = new ();
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGamePlayerRepository _engineGamePlayerRepository;
    private readonly IEngineGameMessageRepository _engineGameMessageRepository;
    private readonly IGameTimingRepository _gameTimingRepository;

    public StartEngineGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IEngineGameRepository engineGameRepository,
        IEngineGamePlayerRepository engineGamePlayerRepository,
        IEngineGameMessageRepository engineGameMessageRepository,
        IGameTimingRepository gameTimingRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _engineGameRepository = engineGameRepository;
        _engineGamePlayerRepository = engineGamePlayerRepository;
        _engineGameMessageRepository = engineGameMessageRepository;
        _gameTimingRepository = gameTimingRepository;
    }

    public async Task<StartEngineGameDto> Handle(StartEngineGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var timing = request.Type != null ? 
            await _gameTimingRepository.FindTiming((TimingTypes)request.Type, (int)(request.Minutes * 60)!, (int)request.Increment!) 
                ?? throw new NotImplementedException() 
            : null;
        

        var player = new EngineGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            Color = _random.Next(2) == 0 ? PieceColor.White : PieceColor.Black,
            UserId = userId,
            TimeLeft = request.Minutes != null ? (double)(request.Minutes * 60) : 0,
        };


        await _engineGamePlayerRepository.Create(player);


        var game = new EngineGame()
        {
            Id = Guid.NewGuid(),
            PlayerId = player.Id,
            StartedAt = DateTime.UtcNow,
            CurrentState = new EngineGameState(),
            TimingType = request.Type,
            GameTimingId = timing != null ? timing.Id : null,
            AllowUndo = request.AllowUndo,
            EngineLevel = request.EngineLevel,
            EngineTimeLeft = request.Minutes != null ? (double)(request.Minutes * 60) : 0,
        };

        var message = new EngineGameMessage()
        {
            Id = Guid.NewGuid(),
            Content = "Game Started",
            RequestorName = "BOT",
            Type = MessageType.Bot,
            GameId = game.Id,
        };


        await _engineGameRepository.Create(game);
        await _engineGameMessageRepository.Create(message);


        var dto = new StartEngineGameDto
        {
            GameId = game.Id,
        };

        return dto;
    }
}
