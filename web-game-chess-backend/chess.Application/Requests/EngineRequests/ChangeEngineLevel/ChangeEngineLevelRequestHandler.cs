
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.ChangeEngineLevel;

/// <summary>
/// Gets game and checks if user is player of game
/// Updates level
/// </summary>
public class ChangeEngineLevelRequestHandler : IRequestHandler<ChangeEngineLevelRequest> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserContextService _userContextService;

    public ChangeEngineLevelRequestHandler(
        IEngineGameRepository engineGameRepository,
        IUserContextService userContextService
    ) {
        _engineGameRepository = engineGameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(ChangeEngineLevelRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");


        game.EngineLevel = request.Level;


        await _engineGameRepository.Update(game);
    }
}
