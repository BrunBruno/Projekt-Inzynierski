
using AutoMapper;
using chess.Api.Models.EngineGameModels;
using chess.Application.Requests.EngineRequests.ChangeEngineLevel;
using chess.Application.Requests.EngineRequests.EndEngineGame;
using chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;
using chess.Application.Requests.EngineRequests.GetEngineGame;
using chess.Application.Requests.EngineRequests.GetEngineGameMove;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Requests.EngineRequests.StartEngineGame;
using chess.Application.Requests.EngineRequests.UndoMove;
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

        var result = await _mediator.Send(request);

        return Ok(result);
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
}
