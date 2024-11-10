
using AutoMapper;
using chess.Api.Models.FriendshipModels;
using chess.Application.Requests.FriendshipRequests.BlockUser;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Application.Requests.FriendshipRequests.GetAllNonFriends;
using chess.Application.Requests.FriendshipRequests.GetFriendProfile;
using chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;
using chess.Application.Requests.FriendshipRequests.InviteFriend;
using chess.Application.Requests.FriendshipRequests.RemoveFriend;
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
    /// Creates new friendship, with pending status
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
    /// Creates freindship with rejected status
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("block")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> BlockUser([FromBody] BlockUserModel model) {

        var request = _mapper.Map<BlockUserRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Changes status of pending friendship
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("{friendshipId}/respond")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> RespondToFriendRequest([FromBody] RespondToFriendRequestModel model) {

        var request = _mapper.Map<RespondToFriendRequestRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Gets all users with chosen relation to user
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
    [HttpGet("all-non")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllNonFriends([FromQuery] GetAllNonFriendsModel model) {

        var request = _mapper.Map<GetAllNonFriendsRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }


    /// <summary>
    /// Get user data for other user with established friendship
    /// </summary>
    /// <param name="friendshipId"></param>
    /// <returns></returns>\   
    [HttpGet("{friendshipId}/profile")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetFriendProfile([FromRoute] Guid friendshipId) {

        var request = new GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };

        var friend = await _mediator.Send(request);

        return Ok(friend);
    }


    /// <summary>
    /// 
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("ranking")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetFriendshipRanking([FromQuery] GetFriendshipRankingModel model) {

        var request = _mapper.Map<GetFriendshipRankingRequest>(model);

        var friends = await _mediator.Send(request);

        return Ok(friends);
    }


    /// <summary>
    /// Removes friendships
    /// Remove rejected friendship to unblock user
    /// </summary>
    /// <param name="friendshipId"></param>
    /// <returns></returns>
    [HttpDelete("{friendshipId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> RemoveFriend([FromRoute] Guid friendshipId) {

        var request = new RemoveFriendRequest()
        {
            FriendshipId = friendshipId,
        };

        await _mediator.Send(request);

        return Ok();
    }
}
