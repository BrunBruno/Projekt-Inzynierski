
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class GetTypeHistoryRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockIUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public GetTypeHistoryRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockIUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }
}
