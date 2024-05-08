
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

public class SearchGameRequestHandler : IRequestHandler<SearchGameRequest> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public SearchGameRequestHandler(
        IPlayerRepository playerRepository,
        IUserContextService userContextService,
        IUserRepository userRepository
    ) { 
        _playerRepository = playerRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task Handle(SearchGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var player = new Player()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            Elo = user.Elo,
            UserId = userId,
        };

        await _playerRepository.Create(player);
    }
}
