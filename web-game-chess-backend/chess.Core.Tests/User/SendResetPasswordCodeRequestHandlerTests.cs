using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.SendResetPasswordCode;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class SendResetPasswordCodeRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserVerificationCodeRepository> _mockUserVerificationCodeRepository;
    private readonly Mock<ISmtpService> _mockSmtpService;
    private readonly Mock<IPasswordHasher<UserVerificationCode>> _mockCodeHasher;


    public SendResetPasswordCodeRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserVerificationCodeRepository = new Mock<IUserVerificationCodeRepository>();
        _mockSmtpService = new Mock<ISmtpService>();
        _mockCodeHasher = new Mock<IPasswordHasher<UserVerificationCode>>();
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

        var request = new SendResetPasswordCodeRequest() {
            Email = "test@test.com",
        };


        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        _mockCodeHasher.Setup(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>())).Returns(It.IsAny<string>());


        var handler = new SendResetPasswordCodeRequestHandler(
            _mockUserRepository.Object,
            _mockUserVerificationCodeRepository.Object,
            _mockSmtpService.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.RemoveByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>()), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.Add(It.IsAny<UserVerificationCode>()), Times.Once);
        _mockSmtpService.Verify(x => x.SendPasswordResetVerificationCode(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Was_Not_Found() {

        var request = new SendResetPasswordCodeRequest() {
            Email = "test@test.com",
        };


        // user not returned


        var handler = new SendResetPasswordCodeRequestHandler(
            _mockUserRepository.Object,
            _mockUserVerificationCodeRepository.Object,
            _mockSmtpService.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.RemoveByUserId(It.IsAny<Guid>()), Times.Never);
        _mockCodeHasher.Verify(x => x.HashPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>()), Times.Never);
        _mockUserVerificationCodeRepository.Verify(x => x.Add(It.IsAny<UserVerificationCode>()), Times.Never);
        _mockSmtpService.Verify(x => x.SendPasswordResetVerificationCode(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
