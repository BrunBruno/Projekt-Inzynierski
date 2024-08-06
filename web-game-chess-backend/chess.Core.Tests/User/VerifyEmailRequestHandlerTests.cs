
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class VerifyEmailRequestHandlerTests {

    private readonly Mock<IEmailVerificationCodeRepository> _mockEmailVerificationCodeRepository;
    private readonly Mock<IPasswordHasher<EmailVerificationCode>> _mockCodeHasher;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public VerifyEmailRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockEmailVerificationCodeRepository = new Mock<IEmailVerificationCodeRepository>();
        _mockCodeHasher = new Mock<IPasswordHasher<EmailVerificationCode>>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

}
