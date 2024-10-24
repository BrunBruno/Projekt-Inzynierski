
using chess.Application.Repositories;
using chess.Application.Requests.UserRequests.VerifyEmail;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class VerifyEmailRequestHandlerTests {

    private readonly Mock<IUserVerificationCodeRepository> _mockUserVerificationCodeRepository;
    private readonly Mock<IPasswordHasher<UserVerificationCode>> _mockCodeHasher;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public VerifyEmailRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserVerificationCodeRepository = new Mock<IUserVerificationCodeRepository>();
        _mockCodeHasher = new Mock<IPasswordHasher<UserVerificationCode>>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Updates_User_On_Success() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = false,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Email,
            UserId = exampleUser.Id
        };

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(exampleUser.Id);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(exampleUser.Id)).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Success);
        _mockUserRepository.Setup(x => x.GetById(exampleUser.Id)).ReturnsAsync(exampleUser);


        var handler = new VerifyEmailRequestHandler (
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(exampleUser.Id), Times.Once);
        _mockUserRepository.Verify(x => x.Update(exampleUser), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Code_Was_Not_Found() {

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(Guid.NewGuid());
        // code not returned


        var handler = new VerifyEmailRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }


    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Code_Is_For_Password_Reset() {

        var userId = Guid.NewGuid();

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Password, // password reset code
            UserId = userId
        };

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(userId)).ReturnsAsync(exampleCode);



        var handler = new VerifyEmailRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(userId), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Code_Is_Incorrect() {

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Email,
            UserId = Guid.NewGuid()
        };

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(Guid.NewGuid());
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(It.IsAny<Guid>())).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Failed); // code validation failed


        var handler = new VerifyEmailRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Code_Expired() {

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(-15), // code expired
            Type = UserCodesTypes.Email,
            UserId = Guid.NewGuid()
        };

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(Guid.NewGuid());
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(It.IsAny<Guid>())).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Success);


        var handler = new VerifyEmailRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_User_Was_Not_Found() {

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Email,
            UserId = Guid.NewGuid()
        };

        var request = new VerifyEmailRequest()
        {
            Code = "Code"
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(Guid.NewGuid());
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(It.IsAny<Guid>())).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Success);
        // user not returned



        var handler = new VerifyEmailRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Once);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
