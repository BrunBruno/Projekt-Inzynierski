
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class GetGameTimingRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;

    public GetGameTimingRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
    }
}
