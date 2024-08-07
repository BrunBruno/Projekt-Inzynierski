﻿
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.RegisterUser;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class RegisterUserRequestHandlerTests {

    private readonly Mock<IEmailVerificationCodeRepository> _mockEmailVerificationCodeRepository;
    private readonly Mock<IPasswordHasher<EmailVerificationCode>> _mockCodeHasher;
    private readonly Mock<IPasswordHasher<Entities.User>> _mockPasswordHasher;
    private readonly Mock<ISmtpService> _mockSmtpService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public RegisterUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockEmailVerificationCodeRepository = new Mock<IEmailVerificationCodeRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher<Entities.User>>();
        _mockCodeHasher = new Mock<IPasswordHasher<EmailVerificationCode>>();
        _mockSmtpService = new Mock<ISmtpService>();
    }

    [Fact]
    public async Task Handle_Creates_User_And_Sends_Email_With_Code_On_Success() {

        var request = new RegisterUserRequest()
        {
            Email = "test@test.com",
            Password = "Password@123456",
            ConfirmPassword = "Password@123456",
            Username = "Username",
            Country = "PL",
        };


        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>())).Returns(It.IsAny<string>());
        _mockCodeHasher.Setup(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>())).Returns(It.IsAny<string>());


        var handler = new RegisterUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockSmtpService.Object,
            _mockEmailVerificationCodeRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserRepository.Verify(x => x.GetByUsername(request.Username), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.Password), Times.Once);
        _mockUserRepository.Verify(x => x.Add(It.IsAny<Entities.User>()), Times.Once);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>()), Times.Once);
        _mockEmailVerificationCodeRepository.Verify(x => x.Add(It.IsAny<EmailVerificationCode>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendVerificationCode(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestExeption_When_Email_Format_Is_Incorrect() {

        var request = new RegisterUserRequest()
        {
            Email = "incorrect",
            Password = "Password@123456",
            ConfirmPassword = "Password@123456",
            Username = "Username",
            Country = "PL",
        };


        var handler = new RegisterUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockSmtpService.Object,
            _mockEmailVerificationCodeRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Never);
        _mockUserRepository.Verify(x => x.GetByUsername(request.Username), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.Password), Times.Never);
        _mockUserRepository.Verify(x => x.Add(It.IsAny<Entities.User>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockEmailVerificationCodeRepository.Verify(x => x.Add(It.IsAny<EmailVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendVerificationCode(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequest_Exception_When_Email_Is_Taken() {

        var request = new RegisterUserRequest()
        {
            Email = "test@test.com",
            Password = "Password@123456",
            ConfirmPassword = "Password@123456",
            Username = "Username",
            Country = "PL",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(new Entities.User() { 
            Email = "test@test.com",
            Username = "other", 
        });


        var handler = new RegisterUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockSmtpService.Object,
            _mockEmailVerificationCodeRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserRepository.Verify(x => x.GetByUsername(request.Username), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.Password), Times.Never);
        _mockUserRepository.Verify(x => x.Add(It.IsAny<Entities.User>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockEmailVerificationCodeRepository.Verify(x => x.Add(It.IsAny<EmailVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendVerificationCode(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequest_Exception_When_Username_Is_Taken() {

        var request = new RegisterUserRequest()
        {
            Email = "test@test.com",
            Password = "Password@123456",
            ConfirmPassword = "Password@123456",
            Username = "Username",
            Country = "PL",
        };

        _mockUserRepository.Setup(x => x.GetByUsername(request.Username)).ReturnsAsync(new Entities.User()
        {
            Email = "other@test.com",
            Username = "Username",
        });


        var handler = new RegisterUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockSmtpService.Object,
            _mockEmailVerificationCodeRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserRepository.Verify(x => x.GetByUsername(request.Username), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.Password), Times.Never);
        _mockUserRepository.Verify(x => x.Add(It.IsAny<Entities.User>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockEmailVerificationCodeRepository.Verify(x => x.Add(It.IsAny<EmailVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendVerificationCode(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Passwords_Do_Not_Match() {

        var request = new RegisterUserRequest()
        {
            Email = "test@test.com",
            Password = "Password@123456",
            ConfirmPassword = "Password",
            Username = "Username",
            Country = "PL",
        };


        var handler = new RegisterUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockSmtpService.Object,
            _mockEmailVerificationCodeRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserRepository.Verify(x => x.GetByUsername(request.Username), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.Password), Times.Never);
        _mockUserRepository.Verify(x => x.Add(It.IsAny<Entities.User>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<EmailVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockEmailVerificationCodeRepository.Verify(x => x.Add(It.IsAny<EmailVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendVerificationCode(request.Email, It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}