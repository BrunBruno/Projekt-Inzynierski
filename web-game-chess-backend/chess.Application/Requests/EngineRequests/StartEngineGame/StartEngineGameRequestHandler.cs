
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;


namespace chess.Application.Requests.EngineRequests.StartEngineGame;

public class StartEngineGameRequestHandler : IRequestHandler<StartEngineGameRequest, StartEngineGameDto> {

    private readonly Random _random = new ();
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGamePlayerRepository _engineGamePlayerRepository;

    public StartEngineGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IEngineGameRepository engineGameRepository,
        IEngineGamePlayerRepository engineGamePlayerRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _engineGameRepository = engineGameRepository;
        _engineGamePlayerRepository = engineGamePlayerRepository;
    }

    public async Task<StartEngineGameDto> Handle(StartEngineGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");
        

        var player = new EngineGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            //Color = _random.Next(2) == 0 ? PieceColor.White : PieceColor.Black,
            Color = PieceColor.White,
            UserId = userId,
        };


        await _engineGamePlayerRepository.Create(player);


        var game = new EngineGame()
        {
            Id = Guid.NewGuid(),
            PlayerId = player.Id,
        };


        await _engineGameRepository.Create(game);


        var dto = new StartEngineGameDto
        {
            GameId = game.Id,
        };

        return dto;
    }
}
