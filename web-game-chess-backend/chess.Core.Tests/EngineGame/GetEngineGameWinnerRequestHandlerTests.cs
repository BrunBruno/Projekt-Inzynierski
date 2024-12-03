
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetEngineGameWinnerRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    public GetEngineGameWinnerRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
    }
}
