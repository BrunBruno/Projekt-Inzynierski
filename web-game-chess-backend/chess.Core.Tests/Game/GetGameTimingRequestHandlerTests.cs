
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetGameTiming;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
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

    [Fact]
    public async Task Handle_Returns_Game_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var timingId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            GameTimingId = timingId,

            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
        };

        var gameTiming = new GameTiming()
        {
            Id = timingId,
            Type = TimingTypes.Daily,
            Seconds = 2 * 24 * 60 * 60,
            Increment = 0,
        };

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameTimingRepository.Setup(x => x.GetById(timingId)).ReturnsAsync(gameTiming);


        var handler = new GetGameTimingRequestHandler(
            _mockUserContextService.Object,
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Type.Should().Be(TimingTypes.Daily);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFound_Exception_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetGameTimingRequestHandler(
            _mockUserContextService.Object,
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var timingId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            GameTimingId = timingId,

            WhitePlayer = new Player()
            {
                Name = "Other",
                UserId = Guid.NewGuid(),
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
        };

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetGameTimingRequestHandler(
            _mockUserContextService.Object,
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_GameTiming_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var timingId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            GameTimingId = timingId,

            WhitePlayer = new Player()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
        };

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new GetGameTimingRequestHandler(
            _mockUserContextService.Object,
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
    }
}
