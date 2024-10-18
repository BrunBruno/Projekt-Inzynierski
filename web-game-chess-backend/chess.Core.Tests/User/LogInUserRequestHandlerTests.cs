
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.LogInUser;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class LogInUserRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPasswordHasher<Entities.User>> _mockPasswordHasher;
    private readonly Mock<IJwtService> _mockJwtService;

    public LogInUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher<Entities.User>>();
        _mockJwtService = new Mock<IJwtService>();
    }

    [Fact]
    public async Task Handle_Returns_Token_On_Success() {

        var exampleUser = new Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User,
        };

        var request = new LogInUserRequest()
        {
            EmailOrUsername = "test@test.com",
            Password = "Password@123456",
        };


        _mockUserRepository.Setup(x => x.GetByEmailOrUsername(request.EmailOrUsername)).ReturnsAsync(exampleUser);
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(exampleUser, exampleUser.PasswordHash, request.Password)).Returns(PasswordVerificationResult.Success);
        _mockJwtService.Setup(x => x.GetJwtToken(exampleUser)).Returns("token");


        var handler = new LogInUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockJwtService.Object
        );


        var result = await handler.Handle(request, CancellationToken.None);

        result.Should().BeEquivalentTo(new LogInUserDto()
        {
            Token = "token",
        });


        _mockUserRepository.Verify(x => x.GetByEmailOrUsername(request.EmailOrUsername), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(exampleUser, exampleUser.PasswordHash, request.Password), Times.Once);
        _mockJwtService.Verify(x => x.GetJwtToken(exampleUser), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Email_Is_Invalid() {

        var request = new LogInUserRequest()
        {
            EmailOrUsername = "test@test.com",
            Password = "Password@123456",
        };


        // user not returned for provided email


        var handler = new LogInUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockJwtService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmailOrUsername(request.EmailOrUsername), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<Entities.User>(), It.IsAny<string>(), request.Password), Times.Never);
        _mockJwtService.Verify(x => x.GetJwtToken(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Password_Is_Invalid() {

        var exampleUser = new Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User,
        };

        var request = new LogInUserRequest()
        {
            EmailOrUsername = "test@test.com",
            Password = "Password@123456", // incorrect password
        };


        _mockUserRepository.Setup(x => x.GetByEmailOrUsername(request.EmailOrUsername)).ReturnsAsync(exampleUser);
        _mockPasswordHasher.Setup(x => x.VerifyHashedPassword(exampleUser, exampleUser.PasswordHash, request.Password)).Returns(PasswordVerificationResult.Failed);


        var handler = new LogInUserRequestHandler(
            _mockUserRepository.Object,
            _mockPasswordHasher.Object,
            _mockJwtService.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmailOrUsername(request.EmailOrUsername), Times.Once);
        _mockPasswordHasher.Verify(x => x.VerifyHashedPassword(exampleUser, exampleUser.PasswordHash, request.Password), Times.Once);
        _mockJwtService.Verify(x => x.GetJwtToken(exampleUser), Times.Never);
    }
}
