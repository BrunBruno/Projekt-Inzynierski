
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class AcceptInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IInvitationRepository> _mockInvitationRepository;

    public AcceptInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockInvitationRepository = new Mock<IInvitationRepository>();
    }
}
