﻿
using AutoMapper;
using chess.Api.Models.FriendshipModels;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Application.Requests.FriendshipRequests.GetAllNonFriends;
using chess.Application.Requests.FriendshipRequests.InviteFriend;
using chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FriendshipController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public FriendshipController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Creates new frendship, with pending status
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("invite")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> InviteFriend([FromBody] InviteFriendModel model) {

        var request = _mapper.Map<InviteFriendRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Changes status of pending friendship
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("respond")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> RespondToFriendRequest([FromBody] RespondToFriendRequestModel model) {

        var request = _mapper.Map<RespondToFriendRequestRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Gets all users with choosen relation to user
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("all-by-status")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllFriendsByStatus([FromQuery] GetAllFriendsByStatusModel model) {

        var request = _mapper.Map<GetAllFriendsByStatusRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }


    /// <summary>
    /// Gets all users that are not in relation with user
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("all-non-friends")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllNonFriends([FromQuery] GetAllNonFriendsModel model) {

        var request = _mapper.Map<GetAllNonFriendsRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }
}
