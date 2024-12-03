
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class ChangeEngineLevelRequestHandlerTests {

    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;

    public ChangeEngineLevelRequestHandlerTests() { 
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }
}
