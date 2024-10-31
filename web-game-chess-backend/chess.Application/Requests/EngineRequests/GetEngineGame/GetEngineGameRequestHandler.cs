
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

public class GetEngineGameRequestHandler : IRequestHandler<GetEngineGameRequest, GetEngineGameDto> {

    private readonly IEngineGameRepository _engineGameRepository;

    public GetEngineGameRequestHandler(IEngineGameRepository engineGameRepository) {
        _engineGameRepository = engineGameRepository;
    }

    public async Task<GetEngineGameDto> Handle(GetEngineGameRequest request, CancellationToken cancellationToken) {

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.Color is null)
            throw new BadRequestException("Error starting game.");

        var position = game.FenPosition.Split(" ")[0] 
            ?? throw new BadRequestException("Error starting game.");


        var gameDto = new GetEngineGameDto()
        {
            Position = game.Position,
            Turn = game.Turn,
            HasEnded = game.HasEnded,

            Player = new PlayerDto() { 
                Name = game.Player.Name,
                Color = game.Player.Color.Value,
            },

            Moves = game.Moves.Select(move => new MoveDto() { 
                Move = move.DoneMove,
                Turn = move.Turn,
                OldCoor = move.OldCoordinates,
                NewCoor = move.NewCoordinates,
                CapturedPiece = move.CapturedPiece,
            }).ToList(),
        };

        return gameDto;
    }
}
