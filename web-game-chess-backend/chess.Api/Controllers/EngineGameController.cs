﻿
using AutoMapper;
using chess.Api.Models.EngineGameModels;
using chess.Application.Requests.EngineRequests.ChangeEngineLevel;
using chess.Application.Requests.EngineRequests.EndEngineGame;
using chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;
using chess.Application.Requests.EngineRequests.GetAllEngineGames;
using chess.Application.Requests.EngineRequests.GetEngineGame;
using chess.Application.Requests.EngineRequests.GetEngineGameMove;
using chess.Application.Requests.EngineRequests.GetEngineGameWinner;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Requests.EngineRequests.StartEngineGame;
using chess.Application.Requests.EngineRequests.UndoMove;
using chess.Application.Requests.EngineRequests.UpdateEngineSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EngineGameController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public EngineGameController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Creates new game with engine
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("start")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartEngineGame([FromBody] StartEngineGameModel model) {

        var request = _mapper.Map<StartEngineGameRequest>(model);

        var result = await _mediator.Send(request);

        return Ok(result);
    }


    /// <summary>
    /// Creates done move by player or engine
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("{gameId}/make-move")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> MakeEngineGameMove([FromBody] MakeEngineGameMoveModel model) {

        var request = _mapper.Map<MakeEngineGameMoveRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// To finish game with engine
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("{gameId}/end-game")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> EndEngineGame([FromBody] EndEngineGameModel model) {

        var request = _mapper.Map<EndEngineGameRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Changes engine level
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("{gameId}/change-engine")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> ChangeEngineLevel([FromBody] ChangeEngineLevelModel model) {

        var request = _mapper.Map<ChangeEngineLevelRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// To remove last done moves
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("{gameId}/undo-move")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> UndoMove([FromBody] UndoMoveModel model) {

        var request = _mapper.Map<UndoMoveRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// To update engine games related settings
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("update-settings")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> UpdateEngineSettings([FromBody] UpdateEngineSettingsModel model) {

        var request = _mapper.Map<UpdateEngineSettingsRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// To get all game data
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetEngineGame([FromRoute] Guid gameId) {

        var request = new GetEngineGameRequest()
        {
            GameId = gameId,
        };

        var game = await _mediator.Send(request);

        return Ok(game);
    }


    /// <summary>
    /// To get winner from engine game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/winner")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetEngineGameWinner([FromRoute] Guid gameId) {

        var request = new GetEngineGameWinnerRequest()
        {
            GameId = gameId,
        };

        var winner = await _mediator.Send(request);

        return Ok(winner);
    }


    /// <summary>
    /// To get move done by engine
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/engine-move")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetEngineGameMove([FromRoute] Guid gameId) {

        var request = new GetEngineGameMoveRequest()
        {
            GameId = gameId,
        };

        var move = await _mediator.Send(request);

        return Ok(move);
    }


    /// <summary>
    /// To get all messages from current game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpGet("{gameId}/all-messages")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllEngineGameMessages([FromRoute] Guid gameId) {

        var request = new GetAllEngineGameMessagesRequest()
        {
            GameId = gameId,
        };

        var messages = await _mediator.Send(request);

        return Ok(messages);
    }


    /// <summary>
    /// To get all games with engine
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("all-games")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllEngineGames([FromQuery] GetAllEngineGamesModel model) {

        var request = _mapper.Map<GetAllEngineGamesRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }
}
