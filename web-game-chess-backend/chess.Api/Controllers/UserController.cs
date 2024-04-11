
using chess.Api.Models.UserModels;
using chess.Application.Requests.UserRequests.LogIn;
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

    public UserController(IMediator mediator) {
        _mediator = mediator;
    }


    [HttpPost("sign-up")]
    public async Task<IActionResult> Register([FromBody] RegisterUserModel model) {

        var request = new RegisterUserRequest()
        {
            Email = model.Email,
            Username = model.Username,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Password = model.Password,
            ConfirmPassword = model.ConfirmPassword,
            ImageUrl = model.ImageUrl,
        };

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
}
