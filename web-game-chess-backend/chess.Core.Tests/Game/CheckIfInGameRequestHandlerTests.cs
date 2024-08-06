
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class CheckIfInGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public CheckIfInGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }
}
