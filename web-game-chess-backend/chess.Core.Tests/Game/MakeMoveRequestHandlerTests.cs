
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class MakeMoveRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IMoveRepository> _mockMoveRepository;

    public MakeMoveRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockMoveRepository = new Mock<IMoveRepository>();
    }
}
