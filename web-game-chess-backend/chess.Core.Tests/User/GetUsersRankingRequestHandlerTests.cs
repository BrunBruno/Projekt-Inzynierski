
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.UserRequests.GetUser;
using chess.Application.Requests.UserRequests.GetUsersRanking;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.User;

public class GetUsersRankingRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;

    public GetUsersRankingRequestHandlerTests() { 
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Users_Ranking() {

        var userId = Guid.NewGuid();

        var request = new GetUsersRankingRequest()
        {
            PageNumber = 1,
            PageSize = 10,
            Type = TimingTypes.Rapid,
        };

        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetAllOrderByRating(request.Type)).ReturnsAsync(ReturnExampleUsers());


        var handler = new GetUsersRankingRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Items.Count.Should().Be(5);


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetAllOrderByRating(request.Type), Times.Once);
    }


    private static List<Entities.User> ReturnExampleUsers() {

        var exampleUsers = new List<Entities.User>();

        for (var i = 0; i < 5; i++) {
            exampleUsers.Add(new Entities.User()
            {
                Email = "test@test.com",
                Username = "username",

                Elo = new UserElo() { },
                Stats = new UserStats() { },
            });

        }

        return exampleUsers;
    }
}
