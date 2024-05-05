
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.BanUser;
using chess.Application.Requests.UserRequests.GetDataConfiguration;
using chess.Application.Requests.UserRequests.GetUser;
using chess.Application.Requests.UserRequests.IsEmailVerified;
using chess.Application.Requests.UserRequests.LogIn;
using chess.Application.Requests.UserRequests.RegenerateCode;
using chess.Application.Requests.UserRequests.Register;
using chess.Application.Requests.UserRequests.VerifyEmail;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Controllers;


[ApiController]
[Route("api/user")]
public class UserController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public UserController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Registers user and sends email verification code.
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("sign-up")]
    public async Task<IActionResult> Register([FromBody] RegisterUserModel model) {

        var request = _mapper.Map<RegisterUserRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Creates Jwt token
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("sign-in")]
    public async Task<IActionResult> LogIn([FromBody] LogInUserModel model) {

        var request = _mapper.Map<LogInUserRequest>(model);

        var token = await _mediator.Send(request);
        return Ok(token);
    }


    /// <summary>
    /// Removes old code and sends new one
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("regenerate-code")]
    [Authorize(Policy = "IsNotVerified")]
    public async Task<IActionResult> RegenerateCode([FromBody] RegenerateCodeModel model) {

        var request = new RegenerateCodeRequest();

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Adds user to black list
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("ban")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BanUser([FromBody] BanUserModel model) {

        var request = _mapper.Map<BanUserRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Verifies email
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("verify-email")]
    [Authorize(Policy = "IsNotVerified")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailModel model) {

        var request = _mapper.Map<VerifyEmailRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Gets user info
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUser() {

        var request = new GetUserRequest();

        var user = await _mediator.Send(request);
        return Ok(user);
    }


    /// <summary>
    /// Checks if user email is verified
    /// only for already existing accounts
    /// </summary>
    /// <returns></returns>
    [HttpGet("is-verified")]
    [Authorize]
    public async Task<IActionResult> IsEmailVerified() {


        var request = new IsEmailVerifiedRequest();

        var result = await _mediator.Send(request);
        return Ok(result);
    }


    /// <summary>
    /// Gets registration configurations
    /// </summary>
    /// <param name="configurationId"></param>
    /// <returns></returns>
    [HttpGet("configuration/{configurationId}")]
    public async Task<IActionResult> GetDataConfiguration([FromRoute] int configurationId) {

        var request = new GetDataConfigurationRequest()
        {
            ConfigurationId = configurationId,
        };

        var passwordConfiguration = await _mediator.Send(request);
        return Ok(passwordConfiguration);
    }
}
