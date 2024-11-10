
using chess.Application.Repositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.CheckIfUpdateRequired;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class CheckIfUpdateRequiredRequestHandlerTests {

    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;

    public CheckIfUpdateRequiredRequestHandlerTests() {
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
    }

    [Fact]
    public async Task Handle_Returns_IsRequired_Dto_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var game = new  Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            GameTimingId = gameTiming.Id,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = false, // not registered
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
                User = new Entities.User() { 
                    Email = "user@test.com", 
                    Username = "Username",
                }
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Placeholder",
                UserId = userId,
                User = new Entities.User()
                {
                    Email = "test@test.com",
                    Username = "Placeholder",
                }
            },
            CurrentState = new WebGameState(),
        };

        var request = new CheckIfUpdateRequiredRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameTimingRepository.Setup(x => x.GetById(game.GameTimingId)).ReturnsAsync(gameTiming);


        var handler = new CheckIfUpdateRequiredRequestHandler(
            _mockGameRepository.Object,
            _mockGameTimingRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        result.IsRequired.Should().Be(true);
        result.Type.Should().Be(TimingTypes.Rapid);

        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(game.GameTimingId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var game = new  Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            GameTimingId = gameTiming.Id,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Placeholder",
                UserId = userId,
            },
            CurrentState = new WebGameState(),
        };

        var request = new CheckIfUpdateRequiredRequest()
        {
            GameId = gameId,
        };

        // game not returned


        var handler = new CheckIfUpdateRequiredRequestHandler(
            _mockGameRepository.Object,
            _mockGameTimingRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(game.GameTimingId), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_GameTiming_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        var game = new  Entities.WebGame()
        {
            Id = gameId,
            IsPrivate = true,

            GameTimingId = gameTiming.Id,

            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Name = "Username",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Name = "Placeholder",
                UserId = userId,
            },
        };

        var request = new CheckIfUpdateRequiredRequest()
        {
            GameId = gameId,
        };


        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // game timing not returned


        var handler = new CheckIfUpdateRequiredRequestHandler(
            _mockGameRepository.Object,
            _mockGameTimingRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameTimingRepository.Verify(x => x.GetById(game.GameTimingId), Times.Once);
    }
}
