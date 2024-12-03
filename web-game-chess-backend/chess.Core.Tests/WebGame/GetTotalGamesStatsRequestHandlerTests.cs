
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.GetTotalGamesStats;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class GetTotalGamesStatsRequestHandlerTests {

    private readonly Mock<IWebGameRepository> _mockWebGameRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetTotalGamesStatsRequestHandlerTests() { 
        _mockWebGameRepository = new Mock<IWebGameRepository>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Returns_Stats_Dto_On_Success() {


        var request = new GetTotalGamesStatsRequest() { };


        _mockWebGameRepository.Setup(x => x.GetAllPlayedToday()).ReturnsAsync(ReturnExampleGames());
        _mockUserRepository.Setup(x => x.GetAllJoinedToday()).ReturnsAsync(ReturnExampleUsers());

        var handler = new GetTotalGamesStatsRequestHandler(
            _mockWebGameRepository.Object,
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);

        result.Should().NotBeNull();
        result.GamesPlayed.Should().Be(5);
        result.UsersJoined.Should().Be(10);


        _mockWebGameRepository.Verify(x => x.GetAllPlayedToday(), Times.Once);
        _mockUserRepository.Verify(x => x.GetAllJoinedToday(), Times.Once);
    }

    private static List<Entities.User> ReturnExampleUsers() {

        var exampleUsers = new List<Entities.User>();

        for (int i = 0; i < 10; i++) {
            exampleUsers.Add(new Entities.User() { 
                Email = "test@test.com", 
                Username = "username",
                JoinDate = DateTime.Now,
            });
        }

        return exampleUsers;
    }

    private static List<Entities.WebGame> ReturnExampleGames() { 
        
        var exampleGames = new List<Entities.WebGame>();

        for (int i = 0; i < 10; i++) {
            exampleGames.Add(new Entities.WebGame() { 
                CreatedAt = i < 5 ? DateTime.Now : DateTime.Now.AddDays(7),
            });
        }

        return exampleGames;
    }
}
