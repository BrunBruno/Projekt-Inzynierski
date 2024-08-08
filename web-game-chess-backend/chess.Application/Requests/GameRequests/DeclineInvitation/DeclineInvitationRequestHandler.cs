﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.DeclineInvitation;

/// <summary>
/// Checks if game for provided id exists
/// Checks if user is participant of the game
/// Checks if invitation for game exists
/// Removes game invitation
/// </summary>
public class DeclineInvitationRequestHandler : IRequestHandler<DeclineInvitationRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IGameRepository _gameRepository;
    private readonly IInvitationRepository _invitationRepository;

    public DeclineInvitationRequestHandler(
        IUserContextService userContextService,
        IGameRepository gameRepository,
        IInvitationRepository invitationRepository
    ) {
        _userContextService = userContextService;
        _gameRepository = gameRepository;
        _invitationRepository = invitationRepository;
    }

    public async Task Handle(DeclineInvitationRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new BadRequestException("This is not user game.");

        var invitation = await _invitationRepository.GetByGameId(request.GameId)
             ?? throw new NotFoundException("Invitation not found.");

        await _invitationRepository.Delete(invitation);
    }
}
