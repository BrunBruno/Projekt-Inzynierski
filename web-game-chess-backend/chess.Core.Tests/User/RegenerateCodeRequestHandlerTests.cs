
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.RegenerateCode;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class RegenerateCodeRequestHandlerTests {

    private readonly Mock<IUserVerificationCodeRepository> _mockUserVerificationCodeRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPasswordHasher<UserVerificationCode>> _mockCodeHasher;
    private readonly Mock<ISmtpService> _mockSmtpService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public RegenerateCodeRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserVerificationCodeRepository = new Mock<IUserVerificationCodeRepository>();
        _mockCodeHasher = new Mock<IPasswordHasher<UserVerificationCode>>();
        _mockSmtpService = new Mock<ISmtpService>();
    }

    [Fact]
    public async Task Handle_Creates_And_Sends_New_Code_On_Success() {

        var exampleUser = new Entities.User
        {
            Id = Guid.NewGuid(),
            Email = "test@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var request = new RegenerateCodeRequest();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(exampleUser.Id);
        _mockUserRepository.Setup(x => x.GetById(exampleUser.Id)).ReturnsAsync(exampleUser);
        _mockCodeHasher.Setup(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>())).Returns(It.IsAny<string>());


        var handler = new RegenerateCodeRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockCodeHasher.Object,
            _mockSmtpService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(exampleUser.Id), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.RemoveByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>()), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.Add(It.IsAny<UserVerificationCode>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendEmailVerificationCode(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Was_Not_Found() {

        var request = new RegenerateCodeRequest();


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(It.IsAny<Guid>());


        var handler = new RegenerateCodeRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockCodeHasher.Object,
            _mockSmtpService.Object,
            _mockUserRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.RemoveByUserId(It.IsAny<Guid>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockUserVerificationCodeRepository.Verify(x => x.Add(It.IsAny<UserVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendEmailVerificationCode(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
