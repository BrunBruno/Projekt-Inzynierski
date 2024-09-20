
using chess.Application.Repositories;
using chess.Application.Requests.FriendshipRequests.GetAllNonFriends;
using chess.Application.Services;
using chess.Core.Entities;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class GetAllNonFriendsRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;
    private static readonly Random random = new();

    public GetAllNonFriendsRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Users_On_Success() {

        var userId = Guid.NewGuid();
        var ids = ReturnFriendsIds();
        var users = ReturnUsers();

        var request = new GetAllNonFriendsRequest()
        {
            PageNumber = 1,
            PageSize = 5,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetAllFriendIds(userId, null)).ReturnsAsync(ids);
        _mockUserRepository.Setup(x => x.GetAllNonFriends(ids, userId)).ReturnsAsync(users);


        var handler = new GetAllNonFriendsRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Items.Count.Should().Be(5);
        result.TotalItemsCount.Should().Be(10);
        result.ItemsFrom = 1;
        result.ItemsTo = 5;

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllFriendIds(userId, null), Times.Once);
        _mockUserRepository.Verify(x => x.GetAllNonFriends(ids, userId), Times.Once);
    }

    private List<Guid> ReturnFriendsIds() {

        var ids = new List<Guid>();

        for (int i = 0; i < 10; i++)
            ids.Add(Guid.NewGuid());

        return ids;
    }

    private List<Entities.User> ReturnUsers() {
        var users = new List<Entities.User>();

        for (int i = 0; i < 10; i++) {
            users.Add(new Entities.User() { 
                Id = Guid.NewGuid(),
                Email = RandomString(5) + "@test.com",
                Username = RandomString(10),
                Elo = new UserElo(),
                Stats = new UserStats(),
            }); 
        }

        return users;
    }

    private static string RandomString(int length) {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
