
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.Game;

public class FetchTimeRequestHandlerTests {

    private readonly Mock<IGameRepository> _mockGameRepository;

    public FetchTimeRequestHandlerTests() {
        _mockGameRepository = new Mock<IGameRepository>();
    }
}
