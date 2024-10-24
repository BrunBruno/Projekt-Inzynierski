﻿
using AutoMapper;
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.GetByEmail;
using chess.Application.Requests.UserRequests.GetElo;
using chess.Application.Requests.UserRequests.GetFullUser;
using chess.Application.Requests.UserRequests.GetOtherUser;
using chess.Application.Requests.UserRequests.GetRegisterConf;
using chess.Application.Requests.UserRequests.GetUser;
using chess.Application.Requests.UserRequests.IsEmailVerified;
using chess.Application.Requests.UserRequests.LogInUser;
using chess.Application.Requests.UserRequests.RegenerateCode;
using chess.Application.Requests.UserRequests.RegisterUser;
using chess.Application.Requests.UserRequests.ResetPassword;
using chess.Application.Requests.UserRequests.SendResetPasswordCode;
using chess.Application.Requests.UserRequests.UpdateProfile;
using chess.Application.Requests.UserRequests.VerifyEmail;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace chess.Api.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public UserController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }


    /// <summary>
    /// Registers user and sends email verification code
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPost("sign-up")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterUserModel model) {

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
    public async Task<IActionResult> LogInUser([FromBody] LogInUserModel model) {

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

        var request = new RegenerateCodeRequest() { };

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Verifies email address
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
    /// Sends reset password code
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("send-password-code")]
    public async Task<IActionResult> SendResetPasswordCode([FromBody] SendResetPasswordCodeModel model) {

        var request = _mapper.Map<SendResetPasswordCodeRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Resets user password
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model) {

        var request = _mapper.Map<ResetPasswordRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Updates updatable data for user
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpPut("profile")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileModel model) {

        var request = _mapper.Map<UpdateProfileRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    /// <summary>
    /// Gets basic user info
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
    /// Gets complete user info for account page
    /// </summary>
    /// <returns></returns>
    [HttpGet("full")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetFullUser() {

        var request = new GetFullUserRequest();

        var user = await _mediator.Send(request);

        return Ok(user);
    }


    /// <summary>
    /// Gets user info for other users
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpGet("{userId}/other")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetOtherUser([FromRoute] Guid userId) {

        var request = new GetOtherUserRequest()
        {
            UserId = userId,
        };

        var user = await _mediator.Send(request);

        return Ok(user);
    }


    /// <summary>
    /// Gets elo info
    /// </summary>
    /// <returns></returns>
    [HttpGet("elo")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetElo() {

        var request = new GetEloRequest();

        var elo = await _mediator.Send(request);

        return Ok(elo);
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
    /// Gets user data by email address
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("by-email")]
    [Authorize(Policy = "IsVerified")]
    public async Task<IActionResult> GetByEmail([FromQuery] GetByEmailModel model) {

        var request = _mapper.Map<GetByEmailRequest>(model);

        var user = await _mediator.Send(request);

        return Ok(user);
    }


    /// <summary>
    /// Gets registration configurations
    /// </summary>
    /// <param name="model"></param>
    /// <returns></returns>
    [HttpGet("configuration")]
    public async Task<IActionResult> GetRegisterConf([FromQuery] GetRegisterConfModel model) {

        var request = _mapper.Map<GetRegisterConfRequest>(model);

        var passwordConfiguration = await _mediator.Send(request);

        return Ok(passwordConfiguration);
    }
}
