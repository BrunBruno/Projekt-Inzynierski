
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class EndEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMessageRepository> _mockEngineGameMessageRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public EndEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMessageRepository = new Mock<IEngineGameMessageRepository>();
        _mockUserRepository = new Mock<IUserRepository>();
    }
}
