﻿
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Entities;
using chess.Core.Enums;
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

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserSettingsRepository _userSettingsRepository;
    private readonly IWebGameMessageRepository _webGameMessageRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public GetWebGameRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService,
        IUserSettingsRepository userSettingsRepository,
        IWebGameMessageRepository webGameMessageRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
        _userSettingsRepository = userSettingsRepository;
        _webGameMessageRepository = webGameMessageRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<GetWebGameDto> Handle(GetWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var settings = await _userSettingsRepository.GetByUserId(userId)
            ?? throw new NotFoundException("Settings not found");

        var game = await _webGameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game");


        var friendship = await _friendshipRepository.GetByUsersIds(game.WhitePlayer.UserId, game.BlackPlayer.UserId);


        if(game.StartedAt is null) {
            game.StartedAt = DateTime.UtcNow;

            await _webGameRepository.Update(game);

            // to send only one
            if (userId == game.WhitePlayer.UserId) {
                var startMessages = new List<WebGameMessage>() {
                    new() {
                        Id = Guid.NewGuid(),
                        RequestorName = "BOT",
                        Content = "Game started.",
                        Type = MessageType.Bot,
                        GameId = game.Id,
                    },
                };


                if (friendship != null && friendship.Status == FriendshipStatus.Rejected) {
                    startMessages.Add(new()
                    {
                        Id = Guid.NewGuid(),
                        RequestorName = "BOT",
                        Content = "Chat is off.",
                        Type = MessageType.Bot,
                        GameId = game.Id,
                    });
                }

                await _webGameMessageRepository.CreateMany(startMessages);
            }
        }

        var gameDto = new GetWebGameDto()
        {
            HasEnded = game.HasEnded,
            Position = game.Position,
            Turn = game.Turn,
            TimingType = game.TimingType,
            HalfmoveClock = game.CurrentState.HalfMove,

            EnPassant = game.CurrentState.EnPassant,
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
                Color = (PieceColor)game.WhitePlayer.Color!,

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
                Color = (PieceColor)game.BlackPlayer.Color!,

                ProfilePicture = game.BlackPlayer.User.Image != null ? new ImageDto() 
                {
                    Data = game.BlackPlayer.User.Image.Data,
                    ContentType = game.BlackPlayer.User.Image.ContentType,
                } : null,
            },

            Moves = game.Moves.Select(move => new MoveDto
            {
                Move = move.DoneMove,
                FenMove = move.FenMove,
                Turn = move.Turn,
                OldCoor = move.OldCoordinates,
                NewCoor = move.NewCoordinates,
                CapturedPiece = move.CapturedPiece,
                Position = move.Position,
                Duration = move.MoveDuration,
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
