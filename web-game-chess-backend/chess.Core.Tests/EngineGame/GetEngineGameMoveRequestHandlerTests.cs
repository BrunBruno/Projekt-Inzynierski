
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetEngineGameMoveRequestHandlerTests {

    private readonly Mock<IEngineService> _mockEngineService;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;

    public GetEngineGameMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineService = new Mock<IEngineService>();
    }
}
