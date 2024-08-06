
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class GetAllFinishedGamesRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public GetAllFinishedGamesRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }
}
