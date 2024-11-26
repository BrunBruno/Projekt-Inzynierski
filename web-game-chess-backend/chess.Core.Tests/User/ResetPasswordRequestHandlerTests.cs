
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.ResetPassword;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class ResetPasswordRequestHandlerTests {

    private readonly Mock<IUserVerificationCodeRepository> _mockUserVerificationCodeRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPasswordHasher<UserVerificationCode>> _mockCodeHasher;
    private readonly Mock<IPasswordHasher<Entities.User>> _mockPasswordHasher;

    public ResetPasswordRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserVerificationCodeRepository = new Mock<IUserVerificationCodeRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher<Entities.User>>();
        _mockCodeHasher = new Mock<IPasswordHasher<UserVerificationCode>>();
    }

    [Fact]
    public async Task Handle_Updates_User_Password_On_Success() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Password,
            UserId = exampleUser.Id
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(exampleUser.Id)).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Success);
        _mockPasswordHasher.Setup(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>())).Returns(It.IsAny<string>());



        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Once);
        _mockUserRepository.Verify(x => x.Update(exampleUser), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Not_Exists() {

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        // user not returned


        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Never);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequest_Exception_When_Passwords_Do_Not_Match() {

          var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@", // not matching
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);


        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(It.IsAny<Guid>()), Times.Never);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_VerificationCode_Does_Not_Exists() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Password,
            UserId = exampleUser.Id
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        // code not returned



        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Type_Of_Code_Is_Incorrect() {

         var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Email, // incorrect type
            UserId = exampleUser.Id
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(exampleUser.Id)).ReturnsAsync(exampleCode);


        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(It.IsAny<UserVerificationCode>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Code_Verification_Fails() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(15),
            Type = UserCodesTypes.Password,
            UserId = exampleUser.Id
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(exampleUser.Id)).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Failed); // code verification fails


        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Code_Verification_Expired() {

        var exampleUser = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "user@test.com",
            Username = "Username",
            IsVerified = true,
            PasswordHash = "PasswordHash",
            RoleId = (int)Roles.User
        };

        var exampleCode = new UserVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "CodeHash",
            ExpirationDate = DateTime.UtcNow.AddMinutes(-15), // expired code
            Type = UserCodesTypes.Password,
            UserId = exampleUser.Id
        };

        var request = new ResetPasswordRequest()
        {
            Email = "user@test.com",
            Code = "123123",
            NewPassword = "Password@123456",
            ConfirmPassword = "Password@123456",
        };

        _mockUserRepository.Setup(x => x.GetByEmail(request.Email)).ReturnsAsync(exampleUser);
        _mockUserVerificationCodeRepository.Setup(x => x.GetByUserId(exampleUser.Id)).ReturnsAsync(exampleCode);
        _mockCodeHasher.Setup(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code)).Returns(PasswordVerificationResult.Success);


        var handler = new ResetPasswordRequestHandler(
            _mockUserVerificationCodeRepository.Object,
            _mockUserRepository.Object,
            _mockCodeHasher.Object,
            _mockPasswordHasher.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserRepository.Verify(x => x.GetByEmail(request.Email), Times.Once);
        _mockUserVerificationCodeRepository.Verify(x => x.GetByUserId(exampleUser.Id), Times.Once);
        _mockCodeHasher.Verify(x => x.VerifyHashedPassword(exampleCode, exampleCode.CodeHash, request.Code), Times.Once);
        _mockPasswordHasher.Verify(x => x.HashPassword(It.IsAny<Entities.User>(), It.IsAny<string>()), Times.Never);
        _mockUserRepository.Verify(x => x.Update(It.IsAny<Entities.User>()), Times.Never);
    }
}
