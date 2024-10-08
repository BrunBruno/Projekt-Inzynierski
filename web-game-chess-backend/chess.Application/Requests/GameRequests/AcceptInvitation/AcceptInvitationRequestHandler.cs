﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptInvitation;

/// <summary>
/// Checks if players for both users exists
/// Checks if user is invitee
/// Checks if invitation for game exists
/// Updates players and invitation
/// </summary>
public class AcceptInvitationRequestHandler : IRequestHandler<AcceptInvitationRequest> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;
    private readonly IGameInvitationRepository _gameInvitationRepository;

    public AcceptInvitationRequestHandler(
        IPlayerRepository playerRepository,
        IUserContextService userContextService,
        IGameInvitationRepository gameInvitationRepository
    ) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
        _gameInvitationRepository = gameInvitationRepository;
    }

    public async Task Handle(AcceptInvitationRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var inviter = await _playerRepository.GetByUserIdAndGameId(request.InviterId, request.GameId)
            ?? throw new NotFoundException("Player not found.");

        var invitee  = await _playerRepository.GetByUserIdAndGameId(request.InviteeId, request.GameId)
            ?? throw new NotFoundException("Player not found.");

        if (userId != invitee.UserId)
            throw new BadRequestException("This user can not accept chosen game.");

        var invitation = await _gameInvitationRepository.GetByGameId(request.GameId)
              ?? throw new NotFoundException("Invitation not found.");


        inviter.IsPlaying = true;
        invitee.IsPlaying = true;
        invitation.IsAccepted = true;


        await _playerRepository.Update(inviter);
        await _playerRepository.Update(invitee);
        await _gameInvitationRepository.Update(invitation);
    }
}
