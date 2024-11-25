
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.UpdateEngineSettings;

public class UpdateEngineSettingsRequestHandler : IRequestHandler<UpdateEngineSettingsRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public UpdateEngineSettingsRequestHandler(
        IUserContextService userContextService,
        IUserSettingsRepository userSettingsRepository
    ) {
        _userContextService = userContextService;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task Handle(UpdateEngineSettingsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var settings = await _userSettingsRepository.GetByUserId( userId ) 
            ?? throw new NotFoundException("Settings not found.");


        settings.EngineGameCheats = request.AllowCheats != null ? (bool)request.AllowCheats : settings.EngineGameCheats;


        await _userSettingsRepository.Update(settings);
    }
}
