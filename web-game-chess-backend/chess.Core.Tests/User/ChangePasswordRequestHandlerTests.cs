
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.ChangePassword;
using chess.Application.Services;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class ChangePasswordRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPasswordHasher<Entities.User>> _mockPasswordHasher;

    public ChangePasswordRequestHandlerTests() { 
        _mockPasswordHasher = new Mock<IPasswordHasher<Entities.User>>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Updates_User_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            PasswordHash = "PasswordHash",
        };

        var request = new ChangePasswordRequest() { 
            OldPassword = "oldpass",
            NewPassword = "newpass",
            ConfirmPassword = "newpass"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword)).Returns(PasswordVerificationResult.Success);


        var handler = new ChangePasswordRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(user, It.IsAny<string>(), request.OldPassword), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(user, request.NewPassword), Times.Once);
        _mockUserRepository.Verify(x => x.Update(user), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Not_Exists() {

        var userId = Guid.NewGuid();

        var request = new ChangePasswordRequest()
        {
            OldPassword = "oldpass",
            NewPassword = "newpass",
            ConfirmPassword = "newpass"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new ChangePasswordRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<Entities.User>(), It.IsAny<string>(), request.OldPassword), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.NewPassword), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Passwords_Not_Match() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            PasswordHash = "PasswordHash",
        };

        var request = new ChangePasswordRequest()
        {
            OldPassword = "oldpass",
            NewPassword = "newpass",
            ConfirmPassword = "badpass" // wrong password
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);


        var handler = new ChangePasswordRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<Entities.User>(), It.IsAny<string>(), request.OldPassword), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.NewPassword), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }


    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Old_Password_Is_Incorrent() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            PasswordHash = "PasswordHash",
        };

        var request = new ChangePasswordRequest()
        {
            OldPassword = "oldpass",
            NewPassword = "newpass",
            ConfirmPassword = "newpass"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword)).Returns(PasswordVerificationResult.Failed); // pasword fail


        var handler = new ChangePasswordRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), request.NewPassword), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
