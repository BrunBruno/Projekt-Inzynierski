
using AutoMapper;
using chess.Api.Models.FriendshipModels;
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
    public async Task<IActionResult> Invite([FromBody] InviteFriendModel model) {
        return Ok();
    }

    [HttpPut("accept")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> Accept([FromBody] AcceptFriendModel model) {
        return Ok();
    }

    [HttpGet("all-pending")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllPending() {
        return Ok();
    }

    [HttpGet("all-accepted")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllAccepted() {
        return Ok();
    }

    [HttpDelete("reject/{friendshipId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> Reject([FromRoute] Guid friendshipId) {
        return Ok();
    }
}
