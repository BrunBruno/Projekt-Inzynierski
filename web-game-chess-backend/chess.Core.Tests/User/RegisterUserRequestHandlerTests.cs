
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class RegisterUserRequestHandlerTests {

    private readonly Mock<IEmailVerificationCodeRepository> _mockEmailVerificationCodeRepository;
    private readonly Mock<IPasswordHasher<EmailVerificationCode>> _mockCodeHasher;
    private readonly Mock<IPasswordHasher<Core.Entities.User>> _mockPasswordHasher;
    private readonly Mock<ISmtpService> _mockSmtpService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public RegisterUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockEmailVerificationCodeRepository = new Mock<IEmailVerificationCodeRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher<Core.Entities.User>>();
        _mockCodeHasher = new Mock<IPasswordHasher<EmailVerificationCode>>();
        _mockSmtpService = new Mock<ISmtpService>();
    }
}
