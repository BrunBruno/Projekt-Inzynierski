
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class UpdateEngineSettingsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserSettingsRepository> _mockUserSettingsRepository;

    public UpdateEngineSettingsRequestHandlerTests() { 
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserSettingsRepository = new Mock<IUserSettingsRepository>();
    }
}
