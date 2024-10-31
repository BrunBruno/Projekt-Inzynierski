﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AbortWebGameSearch;

/// <summary>
/// Checks if player exists
/// Checks if player is owed by current user
/// Checks if player is not in playing state
/// Removes player
/// </summary>
public class AbortWebGameSearchRequestHandler : IRequestHandler<AbortWebGameSearchRequest> {

    private readonly IWebGamePlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;

    public AbortWebGameSearchRequestHandler(
        IWebGamePlayerRepository playerRepository,
        IUserContextService userContextService
    ) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(AbortWebGameSearchRequest request, CancellationToken cancellationToken) {

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