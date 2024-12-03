
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;

    public GetEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
    }
}
