
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.AbortSearch;

public class AbortSearchRequestHandler : IRequestHandler<AbortSearchRequest> {

    private readonly IPlayerRepository _playerRepository;

    public AbortSearchRequestHandler(IPlayerRepository playerRepository) {
        _playerRepository = playerRepository;
    }

    public async Task Handle(AbortSearchRequest request, CancellationToken cancellationToken) {

        var playerToDelete = await _playerRepository.GetById(request.PlayerId) 
            ?? throw new NotFoundException("Player not found.");

        if (playerToDelete.IsPlaying)
            throw new BadRequestException("Can not remove player.");

        await _playerRepository.Delete(playerToDelete);
    }
}
