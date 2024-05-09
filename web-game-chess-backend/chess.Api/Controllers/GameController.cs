using AutoMapper;
using chess.Api.Models.GameModels;
using chess.Application.Requests.GameRequests.SearchGame;
using chess.Application.Requests.GameRequests.AbortSearch;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
    /// <returns></returns>
    [HttpPost("search-game")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartSearch([FromBody] SearchGameModel model) {

        var request = _mapper.Map<SearchGameRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Removes player
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    [HttpDelete("abort-search/{playerId}")]
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
