
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
using chess.Application.Requests.GameRequests.GetFinishedGames;
using chess.Application.Requests.GameRequests.GetEndedGame;

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



    [HttpPost("start-search")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartSearch([FromBody] SearchGameModel model) {

        var request = _mapper.Map<SearchGameRequest>(model);

        var ids = await _mediator.Send(request);

        return Ok(ids);
    }


    [HttpGet("check-if-in-game/{playerId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CheckIfInGame([FromRoute] Guid playerId) {

        var request = new CheckIfInGameRequest()
        {
            PlayerId = playerId,
        };

        var isInGame = await _mediator.Send(request);

        return Ok(isInGame);
    }


    [HttpGet("{gameId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetGame([FromRoute] Guid gameId) {

        var request = new GetGameRequest()
        {
            GameId = gameId,
        };

        var game = await _mediator.Send(request);

        return Ok(game);
    }


    [HttpGet("{gameId}/player")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetPlayer([FromRoute] Guid gameId) {

        var request = new GetPlayerRequest()
        {
            GameId = gameId,
        };

        var player = await _mediator.Send(request);

        return Ok(player);
    }

    [HttpGet("{gameId}/ended")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetEndedGame(Guid gameId) {

        var request = new GetEndedGameRequest()
        {
            GameId = gameId,
        };

        var game = await _mediator.Send(request);

        return Ok(game);
    }


    [HttpGet("all-finished")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetFinishedGames([FromQuery] GetFinishedGamesModel model) {

        var request = _mapper.Map<GetFinishedGamesRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }

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
