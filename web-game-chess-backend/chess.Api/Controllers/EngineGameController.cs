
using AutoMapper;
using chess.Api.Models.EngineGameModels;
using chess.Application.Requests.EngineRequests.GetEngineGame;
using chess.Application.Requests.EngineRequests.MakeEngineGameMove;
using chess.Application.Requests.EngineRequests.StartEngineGame;
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

    [HttpPost("start")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartEngineGame([FromBody] StartEngineGameModel model) {

        var request = _mapper.Map<StartEngineGameRequest>(model);

        var game = await _mediator.Send(request);

        return Ok(game);
    }


    [HttpPost("make-move")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> MakeEngineGameMove([FromBody] MakeEngineGameMoveModel model) {

        var request = _mapper.Map<MakeEngineGameMoveRequest>(model);

        var game = await _mediator.Send(request);

        return Ok(game);
    }


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
}
