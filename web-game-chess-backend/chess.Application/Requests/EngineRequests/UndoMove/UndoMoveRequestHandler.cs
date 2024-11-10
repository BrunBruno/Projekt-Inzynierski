
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.UndoMove;

public class UndoMoveRequestHandler : IRequestHandler<UndoMoveRequest> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IEngineGameMoveRepository _engineGameMoveRepository;

    public UndoMoveRequestHandler(
        IEngineGameRepository engineGameRepository,
        IUserContextService userContextService,
        IEngineGameMoveRepository engineGameMoveRepository
    ) {
        _engineGameRepository = engineGameRepository;
        _userContextService = userContextService;
        _engineGameMoveRepository = engineGameMoveRepository;
    }

    public async Task Handle(UndoMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");
    }
}
