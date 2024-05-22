
using AutoMapper;
using chess.Api.Models.FriendshipModels;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
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

    [HttpPost("invite")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> InviteFriend([FromBody] InviteFriendModel model) {

        var request = _mapper.Map<InviteFriendRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }

    [HttpPut("respond")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> RespondToFriendRequest([FromBody] RespondToFriendRequestModel model) {

        var request = _mapper.Map<RespondToFriendRequestRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }

    [HttpGet("all-by-status")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllFriendsByStatus([FromQuery] GetAllFriendsByStatusModel model) {

        var request = _mapper.Map<GetAllFriendsByStatusRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }

    [HttpGet("all-non-friends")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllNonFriends() {

        var request = _mapper.Map<GetAllFriendsByStatusRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }
}
