
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetAllEngineGamesRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGamePlayerRepository> _mockEngineGamePlayerRepository;

    public GetAllEngineGamesRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGamePlayerRepository = new Mock<IEngineGamePlayerRepository>();
    }
}
