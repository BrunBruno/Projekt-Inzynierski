
using chess.Application.Repositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.StartGames;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class StartWebGamesRequestHandlerTests {

    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IGameTimingRepository> _mockGameTimingRepository;
    private readonly Mock<IWebGameStateRepository> _mockGameStateRepository;
    private static readonly Random random = new();

    public StartWebGamesRequestHandlerTests() {
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockGameTimingRepository = new Mock<IGameTimingRepository>();
        _mockGameStateRepository = new Mock<IWebGameStateRepository>();
    }

    [Fact]
    public async Task Handle_Should_Create_Game_On_Success() {

        var timingId = Guid.NewGuid();
        var players = CreateAwaitingPlayers(timingId);

        var gameTiming = new GameTiming()
        {
            Id = timingId,
            Type = TimingTypes.Classic,
            Seconds = 60 * 60,
            Increment = 0,
        };

        var request = new StartGamesRequest()
        {
            TimingId = timingId,
        };


        _mockGameTimingRepository.Setup(x => x.GetById(timingId)).ReturnsAsync(gameTiming);
        _mockPlayerRepository.Setup(x => x.GetAllAvailablePlayersForTiming(timingId)).ReturnsAsync(players);


        var handler = new StartGamesRequestHandler(
            _mockGameRepository.Object,
            _mockPlayerRepository.Object,
            _mockGameStateRepository.Object,
            _mockGameTimingRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().NotThrowAsync();
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetAllAvailablePlayersForTiming(timingId), Times.Once);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Once);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_GameTiming_Does_Not_Exist() {

        var timingId = Guid.NewGuid();

        var request = new StartGamesRequest()
        {
            TimingId = timingId,
        };


        // game timing not returned


        var handler = new StartGamesRequestHandler(
            _mockGameRepository.Object,
            _mockPlayerRepository.Object,
            _mockGameStateRepository.Object,
            _mockGameTimingRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockGameTimingRepository.Verify(x => x.GetById(timingId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetAllAvailablePlayersForTiming(timingId), Times.Never);
        _mockGameRepository.Verify(x => x.Create(It.IsAny<Entities.WebGame>()), Times.Never);
        _mockGameStateRepository.Verify(x => x.Create(It.IsAny<WebGameState>()), Times.Never);
    }

    private static List<WebGamePlayer> CreateAwaitingPlayers(Guid timingId) {

        var players = new List<WebGamePlayer>();

        for(int i = 0; i < 2; i++) {
            players.Add(new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                IsPlaying = false,
                Name = RandomString(5),
                Elo = 1000,
                UserId = Guid.NewGuid(),
                TimingId = timingId,
            });
        }

        return players;
    }

    private static string RandomString(int length) {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
