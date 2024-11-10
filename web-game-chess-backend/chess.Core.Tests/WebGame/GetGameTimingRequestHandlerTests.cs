
using chess.Application.Repositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetGameTiming;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetGameTimingRequestHandlerTests {

    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;

    public GetGameTimingRequestHandlerTests() {
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Game_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var timingId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            GameTimingId = timingId,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
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


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameTimingRepository.Setup(x => x.GetById(timingId)).ReturnsAsync(gameTiming);


        var handler = new GetGameTimingRequestHandler(
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Type.Should().Be(TimingTypes.Daily);

        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFound_Exception_When_Game_Does_Not_Exist() {

        var gameId = Guid.NewGuid();

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        // game not returned


        var handler = new GetGameTimingRequestHandler(
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_GameTiming_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
        var timingId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            GameTimingId = timingId,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Opponent",
                UserId = Guid.NewGuid(),
            },
        };

        var request = new GetGameTimingRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // game timing not returned


        var handler = new GetGameTimingRequestHandler(
            _mockGameTimingRepository.Object,
            _mockGameRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
    }
}
