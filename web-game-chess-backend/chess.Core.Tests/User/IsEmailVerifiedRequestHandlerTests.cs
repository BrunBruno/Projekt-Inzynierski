
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.User;

public class IsEmailVerifiedRequestHandlerTests {

    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public IsEmailVerifiedRequestHandlerTests() {
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }
}
