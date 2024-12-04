
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Requests.EngineRequests.GetAllEngineGames;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.EngineGame;

public class GetAllEngineGamesRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IEngineGamePlayerRepository> _mockEngineGamePlayerRepository;

    public GetAllEngineGamesRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockEngineGamePlayerRepository = new Mock<IEngineGamePlayerRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Games_On_Success() {

        var userId = Guid.NewGuid();

        var request = new GetAllEngineGamesRequest()
        {
            PageNumber = 1,
            PageSize = 10,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockEngineGamePlayerRepository.Setup(x => x.GetAllForUser(userId)).ReturnsAsync(ReturnExamplePlayers());


        var handler = new GetAllEngineGamesRequestHandler(
            _mockUserContextService.Object,
            _mockEngineGamePlayerRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Items.Count.Should().Be(10);  


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockEngineGamePlayerRepository.Verify(x => x.GetAllForUser(userId), Times.Once);
    }

    private static List<EngineGamePlayer> ReturnExamplePlayers() { 
        
        var players = new List<EngineGamePlayer>();

        for (int i = 0; i < 10; i++) {
            players.Add(new EngineGamePlayer()
            {
                Name = "Username",
                Color = i % 2 == 0 ? PieceColor.White : PieceColor.Black,

                Game = new Entities.EngineGame()
                {
                    HasEnded = true,
                    CreatedAt = DateTime.UtcNow,
                },

                User = new Entities.User() { 
                    Username = "Username",
                    Email = "test@test.com",
                }
            });
        }

        return players;
    }
}
