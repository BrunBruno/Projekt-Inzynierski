
using chess.Application.Repositories;
using Moq;

namespace chess.Core.Tests.Game;

public class SendMessageRequestHandlerTests {

    private readonly Mock<IMessageRepository> _mockMessageRepository;

    public SendMessageRequestHandlerTests() {
        _mockMessageRepository = new Mock<IMessageRepository>();
    }
}
