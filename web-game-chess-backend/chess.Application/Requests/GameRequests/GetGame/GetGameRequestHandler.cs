
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame;

public class GetGameRequestHandler : IRequestHandler<GetGameRequest, GetGameDto> {

    private readonly IGameRepository _gameRepository;

    public GetGameRequestHandler(IGameRepository gameRepository) {
        _gameRepository = gameRepository;
    }

    public async Task<GetGameDto> Handle(GetGameRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        var gameDto = new GetGameDto()
        {
            Position = game.Position,
            Turn = game.Turn,
            CreatedAt = game.CreatedAt,
            Duration = game.GameTiming.Minutes,
            Increment = game.GameTiming.Increment,
            EnPassant = game.GameState.EnPassant,
            CanWhiteKingCastle = game.GameState.CanWhiteKingCastle,
            CanWhiteShortRookCastle = game.GameState.CanWhiteShortRookCastle,
            CanWhiteLongRookCastle = game.GameState.CanWhiteLongRookCastle,
            CanBlackKingCastle = game.GameState.CanBlackKingCastle,
            CanBlackShortRookCastle = game.GameState.CanBlackShortRookCastle,
            CanBlackLongRookCastle = game.GameState.CanBlackLongRookCastle,

            WhitePlayer = new GetGamePlayerDto()
            {
                Name = game.WhitePlayer.Name,
                ImageUrl = game.WhitePlayer.ImageUrl,
                Elo = game.BlackPlayer.Elo,
            },

            BlackPlayer = new GetGamePlayerDto()
            {
                Name = game.BlackPlayer.Name,
                ImageUrl = game.BlackPlayer.ImageUrl,
                Elo = game.BlackPlayer.Elo,
            },

            Moves = game.Moves.Select(move => new GetGameMoveDto
            {
                Move = move.DoneMove,
                Turn = move.Turn,
            }).ToList(),
        };

        return gameDto;
    }
}
