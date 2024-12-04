
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.UndoMove;

/// <summary>
/// Gets game and checks if user is player
/// Checks is undone can be applied
/// Removes two last moves
/// Updates game
/// </summary>
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
            ?? throw new NotFoundException("Game not found");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game");

        var moves = await _engineGameMoveRepository.GetAllForGame(game.Id);

        if (moves.Count < 2)
            throw new BadRequestException("Can not undo now");


        var firstMoveToRemove = moves[0];
        var secondMoveToRemove = moves[1];

        string newPosition = moves.Count > 2 ? moves[2].Position : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

        game.Position = newPosition;
        game.Turn -= 2;
        game.Round = (game.Turn / 2) + 1;


        await _engineGameMoveRepository.Delete(firstMoveToRemove);
        await _engineGameMoveRepository.Delete(secondMoveToRemove);

        await _engineGameRepository.Update(game);
    }
}
