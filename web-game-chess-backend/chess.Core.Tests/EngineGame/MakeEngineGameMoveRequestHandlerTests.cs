
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class MakeEngineGameMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMoveRepository> _mockEngineGameMoveRepository;

    public MakeEngineGameMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMoveRepository = new Mock<IEngineGameMoveRepository>();
    }
}
