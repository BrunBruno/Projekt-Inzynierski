
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

/// <summary>
/// Gets game and checks if user is player
/// Checks if player was initialized correctly
/// Creates and return engine game dto
/// </summary>
public class GetEngineGameRequestHandler : IRequestHandler<GetEngineGameRequest, GetEngineGameDto> {

    private readonly IUserContextService _userContextService;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public GetEngineGameRequestHandler(
        IUserContextService userContextService,
        IEngineGameRepository engineGameRepository,
        IUserSettingsRepository userSettingsRepository
    ) {
        _userContextService = userContextService;
        _engineGameRepository = engineGameRepository;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task<GetEngineGameDto> Handle(GetEngineGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var settings = await _userSettingsRepository.GetByUserId(userId)
            ?? throw new NotFoundException("Settings not found.");

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if(game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");

        if (game.Player.Color is null)
            throw new BadRequestException("Error starting game.");

        var gameDto = new GetEngineGameDto()
        {
            HasEnded = game.HasEnded,
            Position = game.Position,
            Turn = game.Turn,
            EngineLevel = game.EngineLevel,
            TimingType = game.TimingType,
            AllowUndo = game.AllowUndo,

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
                Position = move.Position,
            }).ToList(),

            GameSettings = new GameSettingsDto()
            {
                AppearanceOfGamePage = settings.AppearanceOfGamePage,
                AppearanceOfBoard = settings.AppearanceOfBoard,
                AppearanceOfPieces = settings.AppearanceOfPieces,
            },
        };

        return gameDto;
    }
}
