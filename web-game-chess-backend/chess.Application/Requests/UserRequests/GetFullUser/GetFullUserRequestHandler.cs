
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetFullUser;

/// <summary>
/// Checks if user exists
/// Gets all data about user and returns user dto
/// </summary>
public class GetFullUserRequestHandler : IRequestHandler<GetFullUserRequest, GetFullUserDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetFullUserRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<GetFullUserDto> Handle(GetFullUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var userDto = new GetFullUserDto() 
        { 
            IsPrivate = user.IsPrivate,
            Email = user.Email,
            Username = user.Username,
            Name = user.Name,
            JoinDate = user.JoinDate,
            Country = user.Country,
            Bio = user.Bio,

            ProfilePicture = user.Image != null ? new ImageDto() 
            {
                Data = user.Image.Data,
                ContentType = user.Image.ContentType,
            } : null,

            BackgroundImage = user.Background != null ? new ImageDto()
            {
                Data = user.Background.Data,
                ContentType = user.Background.ContentType,
            } : null,

            OnlineOutcomeTotal = new GameOutcomeDto()
            {
                Total = user.Stats.OnlineGamesPlayed,
                Wins = user.Stats.OnlineWins,
                Loses = user.Stats.OnlineLoses,
                Draws = user.Stats.OnlineDraws,
            },

            OfflineOutcomeTotal = new GameOutcomeDto()
            {
                Total = user.Stats.OfflineGamesPlayed,
                Wins = user.Stats.OfflineWins,
                Loses = user.Stats.OfflineLoses,
                Draws = user.Stats.OfflineDraws,
            },

            TimingTypeGamesPlayed = new EloDto()
            {
                Bullet = user.Stats.BulletGamesPlayed,
                Blitz = user.Stats.BlitzGamesPlayed,
                Rapid = user.Stats.RapidGamesPlayed,
                Classic = user.Stats.ClassicGamesPlayed,
                Daily = user.Stats.DailyGamesPlayed,
            },

            Settings = new GameSettingsDto
            {
                AppearanceOfPieces = user.Settings.AppearanceOfPieces,
                AppearanceOfBoard = user.Settings.AppearanceOfBoard,
                AppearanceOfGamePage = user.Settings.AppearanceOfGamePage,
            },

            WinsByCheckMate = user.Stats.WinsByCheckMate,
            WinsByTimeout = user.Stats.WinsByTimeout,
            WinsByResignation = user.Stats.WinsByResignation,
            LosesByCheckMate = user.Stats.LosesByCheckMate,
            LosesByTimeout = user.Stats.LosesByTimeout,
            LosesByResignation = user.Stats.LosesByResignation,
        };


        return userDto;
    }
}
