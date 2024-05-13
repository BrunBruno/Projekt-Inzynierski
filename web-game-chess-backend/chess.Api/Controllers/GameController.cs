using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Requests.GameRequests.SearchGame;
using chess.Application.Requests.GameRequests.AbortSearch;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using chess.Application.Requests.GameRequests.CheckIfInGame;
using chess.Application.Requests.GameRequests.GetGame;
using chess.Application.Requests.GameRequests.GetPlayer;

namespace chess.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public GameController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Creates player
    /// </summary>
    /// <param name="model"></param>
    /// <returns>{ timingId and playerId }</returns>
    [HttpPost("search")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartSearch([FromBody] SearchGameModel model) {

        var request = _mapper.Map<SearchGameRequest>(model);

        var ids = await _mediator.Send(request);

        return Ok(ids);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    [HttpGet("check/{playerId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CheckIfInGame([FromRoute] Guid playerId) {

        var request = new CheckIfInGameRequest()
        {
            PlayerId = playerId,
        };

        var isInGameDto = await _mediator.Send(request);

        return Ok(isInGameDto);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetGame([FromRoute] Guid gameId) {

        var request = new GetGameRequest()
        {
            GameId = gameId,
        };

        var gameDto = await _mediator.Send(request);

        return Ok(gameDto);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/player")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetPlayer([FromRoute] Guid gameId) {

        var request = new GetPlayerRequest()
        {
            GameId = gameId,
        };

        var playerDto = await _mediator.Send(request);

        return Ok(playerDto);
    }

    /// <summary>
    /// Removes player
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    [HttpDelete("abort/{playerId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> AbortSearch([FromRoute] Guid playerId) {

        var request = new AbortSearchRequest()
        {
            PlayerId = playerId,
        };

        await _mediator.Send(request);

        return Ok();
    }

    
}
