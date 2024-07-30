
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.AbortSearch;

/// <summary>
/// Checks if player exists
/// Checks if player is ownd by current user
/// Checks if player is not in playeing state
/// Removes player
/// </summary>
public class AbortSearchRequestHandler : IRequestHandler<AbortSearchRequest> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;

    public AbortSearchRequestHandler(IPlayerRepository playerRepository, IUserContextService userContextService) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(AbortSearchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var playerToDelete = await _playerRepository.GetById(request.PlayerId) 
            ?? throw new NotFoundException("Player not found.");

        if (userId != playerToDelete.UserId)
            throw new BadRequestException("Player do not belong to user.");

        if (playerToDelete.IsPlaying)
            throw new BadRequestException("Can not remove player that is in game.");

        await _playerRepository.Delete(playerToDelete);
    }
}
