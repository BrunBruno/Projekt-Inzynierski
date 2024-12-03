
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class StartEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMessageRepository> _mockEngineGameMessageRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IEngineGamePlayerRepository> _mockEngineGamePlayerRepository;

    public StartEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMessageRepository = new Mock<IEngineGameMessageRepository>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockEngineGamePlayerRepository = new Mock<IEngineGamePlayerRepository>();
    }
}
