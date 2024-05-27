﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptInvitation;

public class AcceptInvitationRequestHandler : IRequestHandler<AcceptInvitationRequest> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;

    public AcceptInvitationRequestHandler(IPlayerRepository playerRepository, IUserContextService userContextService) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(AcceptInvitationRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var invitor = await _playerRepository.GetByUserIdandGameId(request.InvitorId, request.GameId)
            ?? throw new NotFoundException("Player not found.");

        var invitee  = await _playerRepository.GetByUserIdandGameId(request.InviteeId, request.GameId)
            ?? throw new NotFoundException("Player not found.");

        if (userId != invitee.UserId)
            throw new BadRequestException("This user can not accept choosen game.");

        invitor.IsPlaying = true;
        invitee.IsPlaying = true;

        await _playerRepository.Update(invitor);
        await _playerRepository.Update(invitee);
    }
}
