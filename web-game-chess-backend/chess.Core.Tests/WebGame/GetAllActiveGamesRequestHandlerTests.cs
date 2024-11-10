
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetAllActiveGames;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetAllActiveGamesRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;

    public GetAllActiveGamesRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Active_Games_On_Success(){

        var userId = Guid.NewGuid();
        var players = ReturnExamplePlayers(userId);

        var request = new GetAllActiveGamesRequest()
        {
            PageNumber = 1,
            PageSize = 10,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetAllActiveForUser(userId)).ReturnsAsync(players);


        var handler = new GetAllActiveGamesRequestHandler(
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Items.Count.Should().Be(10);
        result.TotalItemsCount.Should().Be(20);
        result.ItemsFrom = 1;
        result.ItemsTo = 10;

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetAllActiveForUser(userId), Times.Once);
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
                FinishedGame = false,  // not ended
                TimeLeft = 24 * 60 * 60,


                User = new Entities.User() 
                { 
                    Email = "user@test.com",
                    Username = "Username",
                }
            };

            var blackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Opponent",
                Color = PieceColor.Black,
                GameId = gameId,
                UserId = Guid.NewGuid(),
                IsPlaying = true,
                FinishedGame = false, // not ended
                TimeLeft = 24 * 60 * 60,

                User = new Entities.User()
                {
                    Email = "opponent@test.com",
                    Username = "Opponent",
                }
            };

            whitePlayer.WhiteGame = new Entities.WebGame()
            {
                Id = gameId,
                HasEnded = false, // not ended
                CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                StartedAt = DateTime.UtcNow.AddMinutes(-20),
                EndedAt = null,
                WinnerColor = PieceColor.White,
                TimingType = TimingTypes.Daily,
                WhitePlayerRegistered = true,
                BlackPlayerRegistered = true,

                WhitePlayer = whitePlayer,
                BlackPlayer = blackPlayer,
            };

            players.Add(whitePlayer);
        }

        return players;
    }
}
