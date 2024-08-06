

using chess.Application.Repositories;
using chess.Application.Services;
using Moq;

namespace chess.Core.Tests.Game; 
internal class CreatePrivateGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockIUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IGameStateRepository> _mockGameStateRepository;
    private readonly Mock<IInvitationRepository> _mockInvitationRepository;
    private readonly Mock<ISmtpService> _mockISmtpService;

    public CreatePrivateGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockIUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameStateRepository = new Mock<IGameStateRepository>();
        _mockInvitationRepository = new Mock<IInvitationRepository>();
        _mockISmtpService = new Mock<ISmtpService>();
    }
}
