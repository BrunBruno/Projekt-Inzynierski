
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class DeclineInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IInvitationRepository> _mockInvitationRepository;

    public DeclineInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockInvitationRepository = new Mock<IInvitationRepository>();
    }
}
