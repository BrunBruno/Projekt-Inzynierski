using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetTypeHistory;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetTypeHistoryRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;

    public GetTypeHistoryRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Games_On_Success() {

        var userId = Guid.NewGuid();
        var players = ReturnExamplePlayers(userId);

        var request = new GetTypeHistoryRequest()
        {
            PageNumber = 1,
            PageSize = 10,
            Type = TimingTypes.Blitz,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetAllFinishedForUser(userId)).ReturnsAsync(players);


        var handler = new GetTypeHistoryRequestHandler(
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Items.Count.Should().Be(10);
        result.TotalItemsCount.Should().Be(20);
        result.ItemsFrom = 1;
        result.ItemsTo = 10;

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetAllFinishedForUser(userId), Times.Once);
    }

    private static List<WebGamePlayer> ReturnExamplePlayers(Guid userId) {

        var players = new List<WebGamePlayer>();

        for (int i = 0; i < 20; i++) {
            var gameId = Guid.NewGuid();

            var whitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Username",
                Color = PieceColor.White,
                GameId = gameId,
                UserId = userId,
                IsPlaying = true,
            };

            var blackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                Color = PieceColor.Black,
                GameId = gameId,
                UserId = Guid.NewGuid(),
                IsPlaying = true,
            };

            whitePlayer.WhiteGame = new Entities.WebGame()
            {
                Id = gameId,
                HasEnded = true,
                CreatedAt = DateTime.UtcNow,
                StartedAt = DateTime.UtcNow.AddMinutes(10),
                WinnerColor = PieceColor.White,
                TimingType = TimingTypes.Blitz,

                WhitePlayer = whitePlayer,
                BlackPlayer = blackPlayer,
                WhitePlayerRegistered = true,
                BlackPlayerRegistered = true,
            };

            players.Add(whitePlayer);
        }

        return players;
    }
}
