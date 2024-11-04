
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeEngineGameMove;

public class MakeEngineGameMoveRequestHandler : IRequestHandler<MakeEngineGameMoveRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGameMoveRepository _engineGameMoveRepository;

    public MakeEngineGameMoveRequestHandler(
        IUserContextService userContextService,
        IEngineGameRepository engineGameRepository,
        IEngineGameMoveRepository engineGameMoveRepository
    ) {
        _userContextService = userContextService;
        _engineGameRepository = engineGameRepository;
        _engineGameMoveRepository = engineGameMoveRepository;
    }

    public async Task Handle(MakeEngineGameMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.HasEnded)
            throw new BadRequestException("Game is finished.");

        if(game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");

        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        var playerMove = new EngineGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            Position = game.Position,
            OldCoordinates = "",
            NewCoordinates = "",
            Turn = game.Turn,
            GameId = game.Id,
        };


        await _engineGameMoveRepository.Create(playerMove);
        await _engineGameRepository.Update(game);
    }
}
