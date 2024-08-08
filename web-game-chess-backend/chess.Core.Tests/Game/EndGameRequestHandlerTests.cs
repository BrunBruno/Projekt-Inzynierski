
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class EndGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockIUserRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;

    public EndGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockIUserRepository = new Mock<IUserRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Game_On_Success() {

    }
}
