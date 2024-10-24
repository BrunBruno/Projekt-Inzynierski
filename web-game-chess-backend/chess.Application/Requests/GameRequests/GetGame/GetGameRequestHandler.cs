﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame;

/// <summary>
/// Checks if game exists
/// Checks if user is player of provided game
/// Update start time if first get
/// Creates and returns game dto
/// </summary>
public class GetGameRequestHandler : IRequestHandler<GetGameRequest, GetGameDto> {

    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public GetGameRequestHandler(
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task<GetGameDto> Handle(GetGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if(game.StartedAt is null) {
            game.StartedAt = DateTime.UtcNow;

            await _gameRepository.Update(game);
        }

        var gameDto = new GetGameDto()
        {
            HasEnded = game.HasEnded,
            Position = game.Position,
            Turn = game.Turn,
            EnPassant = game.GameState.EnPassant,
            TimingType = game.TimingType,

            CanWhiteKingCastle = game.GameState.CanWhiteKingCastle,
            CanWhiteShortRookCastle = game.GameState.CanWhiteShortRookCastle,
            CanWhiteLongRookCastle = game.GameState.CanWhiteLongRookCastle,
            CanBlackKingCastle = game.GameState.CanBlackKingCastle,
            CanBlackShortRookCastle = game.GameState.CanBlackShortRookCastle,
            CanBlackLongRookCastle = game.GameState.CanBlackLongRookCastle,

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
