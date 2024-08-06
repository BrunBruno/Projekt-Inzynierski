
using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game;

public class GetAllInvitationsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IInvitationRepository> _mockInvitationRepository;

    public GetAllInvitationsRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockInvitationRepository = new Mock<IInvitationRepository>();
    }
}
