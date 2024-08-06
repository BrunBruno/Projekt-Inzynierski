
using chess.Application.Repositories;
using chess.Application.Services;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace chess.Core.Tests.User;

public class LogInUserRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPasswordHasher<Core.Entities.User>> _mockPasswordHasher;
    private readonly Mock<IJwtService> _mockJwtService;

    public LogInUserRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPasswordHasher = new Mock<IPasswordHasher<Core.Entities.User>>();
        _mockJwtService = new Mock<IJwtService>();
    }
}
