
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.Game;

public class StartGamesRequestHandlerTests {

    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IGameStateRepository> _mockGameStateRepository;

    public StartGamesRequestHandlerTests() {
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameStateRepository = new Mock<IGameStateRepository>();
    }
}
