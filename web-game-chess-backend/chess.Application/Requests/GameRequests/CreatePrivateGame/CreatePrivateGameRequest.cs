﻿
using chess.Application.Requests.Abstraction;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

/// <summary>
/// Request to create new private game with selected friend
/// </summary>
public class CreatePrivateGameRequest : TimingType, IRequest<CreatePrivateGameDto> {

    /// <summary>
    /// Id of frienship between user and selected friend
    /// </summary>
    public Guid FriendshipId { get; set; }
}
