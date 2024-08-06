
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

internal class RegenerateCodeRequestHandlerTests {

    private readonly Mock<IEmailVerificationCodeRepository> _mockEmailVerificationCodeRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPasswordHasher<EmailVerificationCode>> _mockCodeHasher;
    private readonly Mock<ISmtpService> _mockSmtpService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public RegenerateCodeRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEmailVerificationCodeRepository = new Mock<IEmailVerificationCodeRepository>();
        _mockCodeHasher = new Mock<IPasswordHasher<EmailVerificationCode>>();
        _mockSmtpService = new Mock<ISmtpService>();
    }
}
