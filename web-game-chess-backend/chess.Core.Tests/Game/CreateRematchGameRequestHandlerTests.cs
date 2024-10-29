using chess.Application.Repositories.GameRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.GameRequests.CreateRematchGame;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class CreateRematchGameRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IGameStateRepository> _mockGameStateRepository;

    public CreateRematchGameRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameStateRepository = new Mock<IGameStateRepository>();
    }

    [Fact]
    public async Task Handle_Creates_Game_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "user@test.com",
            Username = "Username",
            Elo = new UserElo(),
        };
        var friend = new Entities.User()
        {
            Id = friendId,
            Email = "friend@test.com",
            Username = "Friend",
            Elo = new UserElo(),
        };

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateRematchGameRequest()
        {
            OpponentId = friendId,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockUserRepository.Setup(x => x.GetById(request.OpponentId)).ReturnsAsync(friend);


        var handler = new CreateRematchGameRequestHandler(
             _mockGameTimingRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object,
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameStateRepository.Object
         
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.GameId.Should().NotBeEmpty();

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.OpponentId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Exactly(2));
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_GameTiming_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateRematchGameRequest()
        {
            OpponentId = friendId,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game timing not returned


        var handler = new CreateRematchGameRequestHandler(
             _mockGameTimingRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object,
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameStateRepository.Object

         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Never);
        _mockUserRepository.Verify(x => x.GetById(request.OpponentId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateRematchGameRequest()
        {
            OpponentId = friendId,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);
        // user not returned


        var handler = new CreateRematchGameRequestHandler(
             _mockGameTimingRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object,
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameStateRepository.Object

         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.OpponentId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friend_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();

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
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var request = new CreateRematchGameRequest()
        {
            OpponentId = friendId,
            Type = gameTiming.Type,
            Minutes = gameTiming.Seconds / 60,
            Increment = gameTiming.Increment,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameTimingRepository.Setup(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment)).ReturnsAsync(gameTiming);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        // opponent user not returned


        var handler = new CreateRematchGameRequestHandler(
             _mockGameTimingRepository.Object,
             _mockGameRepository.Object,
             _mockPlayerRepository.Object,
             _mockUserContextService.Object,
             _mockUserRepository.Object,
             _mockGameStateRepository.Object

         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameTimingRepository.Verify(x => x.FindTiming(request.Type, request.Minutes * 60, request.Increment), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.OpponentId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Create(It.IsAny<Player>()), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.Game>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<GameState>()), Times.Never);
    }
}
