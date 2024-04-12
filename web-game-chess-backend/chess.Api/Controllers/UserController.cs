
using AutoMapper;
using chess.Api.Models.UserModels;
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

[Route("api/user")]
[ApiController]
public class UserController : ControllerBase {

    private readonly IMediator _mediator;
    private readonly IMapper _mapper;

    public UserController(IMediator mediator, IMapper mapper) {
        _mediator = mediator;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUser() {

        var request = new GetUserRequest();

        var user = await _mediator.Send(request);
        return Ok(user);
    }


    [HttpPost("sign-up")]
    public async Task<IActionResult> Register([FromBody] RegisterUserModel model) {

        /*var request = new RegisterUserRequest()
        {
            Email = model.Email,
            Username = model.Username,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Password = model.Password,
            ConfirmPassword = model.ConfirmPassword,
            ImageUrl = model.ImageUrl,
        };*/

        var request = _mapper.Map<RegisterUserRequest>(model);

        await _mediator.Send(request);
        return Ok();
    }


    [HttpPost("sign-in")]
    public async Task<IActionResult> LogIn([FromBody] LogInUserModel model) {

        var request = new LogInUserRequest()
        {
            Email = model.Email,
            Password = model.Password,
        };

        var token = await _mediator.Send(request);
        return Ok(token);
    }


    [HttpPost("regenerate-code")]
    [Authorize(Policy = "IsNotVerified")]
    public async Task<IActionResult> RegenerateCode([FromBody] RegenerateCodeModel model) {

        var request = new RegenerateCodeRequest();

        await _mediator.Send(request);
        return Ok();
    }


    [HttpPut("verify-email")]
    [Authorize(Policy = "IsNotVerified")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailModel model) {

        var request = new VerifyEmailRequest()
        {
            Code = model.Code,
        };

        await _mediator.Send(request);
        return Ok();
    }


    [HttpGet("is-verified")]
    [Authorize]
    public async Task<IActionResult> IsEmailVerified() {

        var request = new IsEmailVerifiedRequest();

        var result = await _mediator.Send(request);
        return Ok(result);
    }
}
