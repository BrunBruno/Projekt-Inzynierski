﻿
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
using chess.Application.Requests.GameRequests.CreatePrivateGame;
using chess.Application.Requests.GameRequests.FetchTime;
using chess.Application.Requests.GameRequests.GetOpponent;
using chess.Application.Requests.GameRequests.CreateRematchGame;
using chess.Application.Requests.GameRequests.GetTypeHistory;
using chess.Application.Requests.GameRequests.CreateGameByEmail;
using chess.Application.Requests.GameRequests.DeclineInvitation;
using chess.Application.Requests.GameRequests.GetAllInvitations;
using chess.Application.Requests.GameRequests.GetGameTiming;

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
    /// Creates player if player not exists
    /// Creates game timing if not exist
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("search")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartSearch([FromBody] SearchGameModel model) {

        var request = _mapper.Map<SearchGameRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates private game
    /// Return created game id
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("private")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreatePrivateGame([FromBody] CreatePrivateGameModel model) {

        var request = _mapper.Map<CreatePrivateGameRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates private game by proving opponent email
    /// Return created game id
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("by-email")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreateGameByEmail([FromBody] CreateGameByEmailModel model) {

        var request = _mapper.Map<CreateGameByEmailRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates new game for two same users taht has already played one game
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("rematch")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreateRematchGame([FromBody] CreateRematchGameModel model) {

        var request = _mapper.Map<CreateRematchGameRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Check if player was matched and the game has started
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("check-if-in-game")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CheckIfInGame([FromQuery] CheckIfInGameModel model) {

        var request = _mapper.Map<CheckIfInGameRequest>(model);

        var isInGame = await _mediator.Send(request);

        return Ok(isInGame);
    }


    /// <summary>
    /// Gets all data for one game
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

        var game = await _mediator.Send(request);

        return Ok(game);
    }


    /// <summary>
    /// Gets all data of player
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

        var player = await _mediator.Send(request);

        return Ok(player);
    }


    /// <summary>
    /// Gets time left for user
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/time")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> FetchTime([FromRoute] Guid gameId) {

        var request = new FetchTimeRequest()
        {
            GameId = gameId,
        };

        var time = await _mediator.Send(request);

        return Ok(time);
    }


    /// <summary>
    /// Gets opponent data
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/opponent")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetOpponent([FromRoute] Guid gameId) {

        var request = new GetOpponentRequest()
        {
            GameId = gameId,
        };

        var opponent = await _mediator.Send(request);

        return Ok(opponent);
    }


    /// <summary>
    /// Gets ended game info
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
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


    /// <summary>
    /// Gets game timing type and configuration
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/timing")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetGameTiming(Guid gameId) {

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };

        var timing = await _mediator.Send(request);

        return Ok(timing);
    }


    /// <summary>
    /// Gets all finished games for user
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("all-finished")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetFinishedGames([FromQuery] GetFinishedGamesModel model) {

        var request = _mapper.Map<GetFinishedGamesRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }


    /// <summary>
    /// Get all previous games for choosen timing type
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("type-history")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetTypeHitory([FromQuery] GetTypeHistoryModel model) {

        var request = _mapper.Map<GetTypeHistoryRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }


    /// <summary>
    /// Gets all previous inivations, taht were untouched
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("invitations")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllInvitations([FromQuery] GetAllInvitationsModel model) {

        var request = _mapper.Map<GetAllInvitationsRequest>(model);

        var invitations = await _mediator.Send(request);

        return Ok(invitations);
    }


    /// <summary>
    /// Removes player
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpDelete("abort")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> AbortSearch([FromQuery] AbortSearchModel model) {

        var request = _mapper.Map<AbortSearchRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }

}
