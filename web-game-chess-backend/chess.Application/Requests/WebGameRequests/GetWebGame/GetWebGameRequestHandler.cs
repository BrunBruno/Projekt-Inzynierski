
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWebGame;

/// <summary>
/// Checks if game exists
/// Checks if user is player of provided game
/// Update start time if first get
/// Creates and returns game dto
/// </summary>
public class GetWebGameRequestHandler : IRequestHandler<GetWebGameRequest, GetWebGameDto> {

    private readonly IWebGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public GetWebGameRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task<GetWebGameDto> Handle(GetWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if(game.StartedAt is null) {
            game.StartedAt = DateTime.UtcNow;

            await _gameRepository.Update(game);
        }

        var gameDto = new GetWebGameDto()
        {
            HasEnded = game.HasEnded,
            Position = game.Position,
            Turn = game.Turn,
            EnPassant = game.CurrentState.EnPassant,
            TimingType = game.TimingType,

            CanWhiteKingCastle = game.CurrentState.CanWhiteKingCastle,
            CanWhiteShortRookCastle = game.CurrentState.CanWhiteShortRookCastle,
            CanWhiteLongRookCastle = game.CurrentState.CanWhiteLongRookCastle,
            CanBlackKingCastle = game.CurrentState.CanBlackKingCastle,
            CanBlackShortRookCastle = game.CurrentState.CanBlackShortRookCastle,
            CanBlackLongRookCastle = game.CurrentState.CanBlackLongRookCastle,

            WhitePlayer = new PlayerDto()
            {
                Name = game.WhitePlayer.Name,
                Elo = game.WhitePlayer.Elo,

                ProfilePicture = game.WhitePlayer.User.Image != null ? new ImageDto() 
                {
                    Data = game.WhitePlayer.User.Image.Data,
                    ContentType = game.WhitePlayer.User.Image.ContentType,
                } : null,
            },

            BlackPlayer = new PlayerDto()
            {
                Name = game.BlackPlayer.Name,
                Elo = game.BlackPlayer.Elo,

                ProfilePicture = game.BlackPlayer.User.Image != null ? new ImageDto() 
                {
                    Data = game.BlackPlayer.User.Image.Data,
                    ContentType = game.BlackPlayer.User.Image.ContentType,
                } : null,
            },

            Moves = game.Moves.Select(move => new MoveDto
            {
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
