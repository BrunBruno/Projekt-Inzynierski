
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
            HasEnded = game.HasEnded,
            Position = game.Position,
            Turn = game.Turn,
            EngineLevel = game.EngineLevel,
            TimingType = game.TimingType,

            EnPassant = game.CurrentState.EnPassant,
            CanWhiteKingCastle = game.CurrentState.CanWhiteKingCastle,
            CanWhiteShortRookCastle = game.CurrentState.CanWhiteShortRookCastle,
            CanWhiteLongRookCastle = game.CurrentState.CanWhiteLongRookCastle,
            CanBlackKingCastle = game.CurrentState.CanBlackKingCastle,
            CanBlackShortRookCastle = game.CurrentState.CanBlackShortRookCastle,
            CanBlackLongRookCastle = game.CurrentState.CanBlackLongRookCastle,

            Player = new PlayerDto() { 
                Name = game.Player.Name,
                Color = game.Player.Color.Value,

                ProfilePicture = game.Player.User.Image != null ? new ImageDto()
                {
                    Data = game.Player.User.Image.Data,
                    ContentType = game.Player.User.Image.ContentType,
                } : null,
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
