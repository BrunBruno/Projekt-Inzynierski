
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateUserSettings;

/// <summary>
/// Checks if user settings exists
/// Updates provided value of game settings
/// </summary>
public class UpdateUserSettingsRequestHandler : IRequestHandler<UpdateUserSettingsRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public UpdateUserSettingsRequestHandler(
        IUserContextService userContextService,
        IUserSettingsRepository userSettingsRepository
    ) {
        _userContextService = userContextService;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task Handle(UpdateUserSettingsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var settings = await _userSettingsRepository.GetByUserId(userId)
            ?? throw new NotFoundException("Settings not found");


        settings.AppearanceOfBoard = request.AppearanceOfBoard != null ? (AppearanceOfBoard)request.AppearanceOfBoard : settings.AppearanceOfBoard;
        settings.AppearanceOfGamePage = request.AppearanceOfGamePage != null ? (AppearanceOfGamePage)request.AppearanceOfGamePage : settings.AppearanceOfGamePage;
        settings.AppearanceOfPieces = request.AppearanceOfPieces != null ? (AppearanceOfPieces)request.AppearanceOfPieces : settings.AppearanceOfPieces;


        await _userSettingsRepository.Update(settings);
    }
}
