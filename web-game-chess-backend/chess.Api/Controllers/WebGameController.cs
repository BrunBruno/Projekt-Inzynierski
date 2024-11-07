
using AutoMapper;
using chess.Application.Requests.WebGameRequests.SearchGame;
using chess.Application.Requests.WebGameRequests.AbortWebGameSearch;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using chess.Application.Requests.WebGameRequests.CheckIfInGame;
using chess.Application.Requests.WebGameRequests.GetWebGame;
using chess.Application.Requests.WebGameRequests.GetPlayer;
using chess.Application.Requests.WebGameRequests.GetEndedWebGame;
using chess.Application.Requests.WebGameRequests.CreatePrivateGame;
using chess.Application.Requests.WebGameRequests.FetchTime;
using chess.Application.Requests.WebGameRequests.GetOpponent;
using chess.Application.Requests.WebGameRequests.GetTypeHistory;
using chess.Application.Requests.WebGameRequests.CreateGameByEmail;
using chess.Application.Requests.WebGameRequests.GetAllInvitations;
using chess.Application.Requests.WebGameRequests.GetGameTiming;
using chess.Application.Requests.WebGameRequests.GetAllFinishedGames;
using chess.Application.Requests.WebGameRequests.GetAllMessages;
using chess.Application.Requests.WebGameRequests.CreateGameWithLink;
using chess.Application.Requests.WebGameRequests.CheckIfUpdateRequired;
using chess.Application.Requests.WebGameRequests.CancelPrivateWebGame;
using chess.Application.Requests.WebGameRequests.GetAllActiveGames;
using chess.Api.Models.WebGameModels;
using chess.Application.Requests.WebGameRequests.GetTotalGamesStats;

namespace chess.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WebGameController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public WebGameController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Creates player if player not exists
    /// Creates game timing if not exist
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Essential for game creation </returns>
    [HttpPost("search")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> StartSearch([FromBody] SearchWebGameModel model) {

        var request = _mapper.Map<SearchGameRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates private game
    /// Return created game id
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Essential for game creation </returns>
    [HttpPost("private")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreatePrivateGame([FromBody] CreatePrivateWebGameModel model) {

        var request = _mapper.Map<CreatePrivateGameRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates private game by proving opponent email
    /// Return created game id
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Essential for game creation </returns>
    [HttpPost("email")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreateGameByEmail([FromBody] CreateWebGameByEmailModel model) {

        var request = _mapper.Map<CreateGameByEmailRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Creates private game with link and returns it
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Essential for game creation </returns>
    [HttpPost("link")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CreateGameWithLink([FromBody] CreateWebGameWithLinkModel model) {

        var request = _mapper.Map<CreateGameWithLinkRequest>(model);

        var gameData = await _mediator.Send(request);

        return Ok(gameData);
    }


    /// <summary>
    /// Check if player was matched and the game has started
    /// </summary>
    /// <param name="model"></param>
    /// <returns> bool value </returns>
    [HttpGet("is-in-game")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CheckIfInGame([FromQuery] CheckIfInGameModel model) {

        var request = _mapper.Map<CheckIfInGameRequest>(model);

        var isInGame = await _mediator.Send(request);

        return Ok(isInGame);
    }


    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns> bool value </returns>
    [HttpGet("{gameId}/update-required")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CheckIfUpdateRequired([FromRoute] Guid gameId) {

        var request = new CheckIfUpdateRequiredRequest()
        { 
            GameId = gameId,
        };

        var isRequired = await _mediator.Send(request);

        return Ok(isRequired);
    }


    /// <summary>
    /// Gets all data for one game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns> Game </returns>
    [HttpGet("{gameId}")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetGame([FromRoute] Guid gameId) {

        var request = new GetWebGameRequest()
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
    /// <returns> Player </returns>
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
    /// <returns> Players time </returns>
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
    /// Gets opponent data from previous game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns> Player </returns>
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
    /// <returns> Game </returns>
    [HttpGet("{gameId}/ended")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetEndedGame([FromRoute] Guid gameId) {

        var request = new GetEndedWebGameRequest()
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
    /// <returns> Game timing </returns>
    [HttpGet("{gameId}/timing")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetGameTiming([FromRoute] Guid gameId) {

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };

        var timing = await _mediator.Send(request);

        return Ok(timing);
    }


    /// <summary>
    /// Gets all ongoing games for user
    /// </summary>
    /// <param name="model"></param>
    /// <returns>  Page result of games </returns>
    [HttpGet("all-ongoing")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllActiveGames([FromQuery] GetAllActiveWebGamesModel model) {

        var request = _mapper.Map<GetAllActiveGamesRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }


    /// <summary>
    /// Gets all finished games for user
    /// </summary>
    /// <param name="model"></param>
    /// <returns>  Page result of games </returns>
    [HttpGet("all-finished")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllFinishedGames([FromQuery] GetAllFinishedWebGamesModel model) {

        var request = _mapper.Map<GetAllFinishedGamesRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }


    /// <summary>
    /// Get all previous games for chosen timing type
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Page result of games </returns>
    [HttpGet("type-history")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetTypeHistory([FromQuery] GetTypeHistoryModel model) {

        var request = _mapper.Map<GetTypeHistoryRequest>(model);

        var games = await _mediator.Send(request);

        return Ok(games);
    }


    /// <summary>
    /// Gets all previous invitations, that were untouched
    /// </summary>
    /// <param name="model"></param>
    /// <returns> Paged result of invitations </returns>
    [HttpGet("invitations")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllInvitations([FromQuery] GetAllInvitationsModel model) {

        var request = _mapper.Map<GetAllInvitationsRequest>(model);

        var invitations = await _mediator.Send(request);

        return Ok(invitations);
    }


    /// <summary>
    /// Gets all messages for current game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns> List of messages </returns>
    [HttpGet("{gameId}/messages")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetAllMessages([FromRoute] Guid gameId) {

        var request = new GetAllMessagesRequest() 
        { 
            GameId = gameId,
        };

        var messages = await _mediator.Send(request);

        return Ok(messages);
    }


    /// <summary>
    /// 
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("stats")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetTotalGamesStats([FromQuery] GetTotalGamesStatsModel model) {

        var request = _mapper.Map<GetTotalGamesStatsRequest>(model);

        var data = await _mediator.Send(request);

        return Ok(data);
    }


    /// <summary>
    /// Removes player
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpDelete("abort")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> AbortWebGameSearch([FromQuery] AbortWebGameSearchModel model) {

        var request = _mapper.Map<AbortWebGameSearchRequest>(model);

        await _mediator.Send(request);

        return Ok();
    }


    /// <summary>
    /// Removes private games 
    /// Removes players
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    [HttpDelete("{gameId}/cancel")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> CancelPrivateGame([FromRoute] Guid gameId) {

        var request = new CancelPrivateWebGameRequest() 
        {
            GameId = gameId,
        };

        await _mediator.Send(request);

        return Ok();
    }
}
