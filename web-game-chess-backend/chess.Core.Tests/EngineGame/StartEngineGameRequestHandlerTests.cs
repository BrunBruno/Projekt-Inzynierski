
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.EngineRequests.StartEngineGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class StartEngineGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGameRepository> _mockEngineGameRepository;
    private readonly Mock<IEngineGameMessageRepository> _mockEngineGameMessageRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IEngineGamePlayerRepository> _mockEngineGamePlayerRepository;

    public StartEngineGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGameRepository = new Mock<IEngineGameRepository>();
        _mockEngineGameMessageRepository = new Mock<IEngineGameMessageRepository>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockEngineGamePlayerRepository = new Mock<IEngineGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Games_And_Player_And_Returns_GameId_On_Success() { 
    
        var userId = Guid.NewGuid();

        var user = new Entities.User() {
            Id = userId,
            Email = "test@test.com",
            Username = "Username",

            Elo = new UserElo(),
        };

        var request = new StartEngineGameRequest()
        {
            EngineLevel = 4,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);


        var handler = new StartEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGamePlayerRepository.Object,
            _mockEngineGameMessageRepository.Object 
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.GameId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGamePlayerRepository.Verify(x => x.Create(It.IsAny<EngineGamePlayer>()), Times.Once);
        _mockEngineGameRepository.Verify(x => x.Create(It.IsAny<Entities.EngineGame>()), Times.Once);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Not_Exists() {

        var userId = Guid.NewGuid();


        var request = new StartEngineGameRequest()
        {
            EngineLevel = 4,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new StartEngineGameRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockEngineGameRepository.Object,
            _mockEngineGamePlayerRepository.Object,
            _mockEngineGameMessageRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockEngineGamePlayerRepository.Verify(x => x.Create(It.IsAny<EngineGamePlayer>()), Times.Never);
        _mockEngineGameRepository.Verify(x => x.Create(It.IsAny<Entities.EngineGame>()), Times.Never);
        _mockEngineGameMessageRepository.Verify(x => x.Create(It.IsAny<EngineGameMessage>()), Times.Never);
    }
}
