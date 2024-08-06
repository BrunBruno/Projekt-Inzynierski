
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class SearchGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockIUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;

    public SearchGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockIUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
    }
}
