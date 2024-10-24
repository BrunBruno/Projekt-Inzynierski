
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.SearchGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class SearchGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;

    public SearchGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
    }

    [Fact]
    public async Task Handle_Should_Return_TimingDto_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Bullet,
            Seconds = 60,
            Increment = 1,
        };

        var player = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            IsPlaying = false,
        };

        var request = new SearchGameRequest()
        {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 1,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);
        _mockPlayerRepository.Setup(x => x.GetAwaitingPlayer(userId, gameTiming.Id)).ReturnsAsync(player);


        var handler = new SearchGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockGameTimingRepository.Object
        );


        var result = await handler.Handle(request, CancellationToken.None);


        result.TimingId.Should().Be(gameTiming.Id);
        result.PlayerId.Should().Be(player.Id);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.GetAwaitingPlayer(userId, gameTiming.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Should_Create_Player_And_Return_TimingDto_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Bullet,
            Seconds = 60,
            Increment = 1,
        };

        var request = new SearchGameRequest() 
        {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 1,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);
        // player not exists


        var handler = new SearchGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockGameTimingRepository.Object
        );


        var result = await handler.Handle(request, CancellationToken.None);


        result.TimingId.Should().Be(gameTiming.Id);
        result.PlayerId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.GetAwaitingPlayer(userId, gameTiming.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Should_Create_GameTiming_And_Player_And_Return_TimingDto_On_Success() {

        var userId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };

        var request = new SearchGameRequest()
        {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 1,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);


        var handler = new SearchGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockGameTimingRepository.Object
        );


        var result = await handler.Handle(request, CancellationToken.None);


        result.TimingId.Should().NotBeEmpty();
        result.PlayerId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetAwaitingPlayer(userId, It.IsAny<Guid>()), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();

        var request = new SearchGameRequest()
        {
            Type = TimingTypes.Bullet,
            Minutes = 1,
            Increment = 1,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new SearchGameRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockGameTimingRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Never);
        _mockGameTimingRepository.Verify(x => x.Create(It.IsAny<GameTiming>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.GetAwaitingPlayer(userId, It.IsAny<Guid>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
    }
}
