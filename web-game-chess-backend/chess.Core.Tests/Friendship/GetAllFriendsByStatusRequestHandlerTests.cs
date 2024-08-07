
using chess.Application.Repositories;
using chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using FluentAssertions;
using Moq;
using Xunit.Abstractions;

namespace chess.Core.Tests.Friendship; 

public class GetAllFriendsByStatusRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;
    private static Random random = new Random();

    public GetAllFriendsByStatusRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_Users_On_Success() {

        var userId = Guid.NewGuid();
        var friendships = ReturnExampleFriendships(userId, FriendshipStatus.Accepted);

        var request = new GetAllFriendsByStatusRequest()
        {
            PageNumber = 1,
            PageSize = 5,
            Status = FriendshipStatus.Accepted,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted)).ReturnsAsync(friendships);
        foreach(var friendship in friendships) {
            _mockUserRepository.Setup(x => x.GetById(friendship.ReceiverId)).ReturnsAsync(new Entities.User()
            {
                Id = friendship.ReceiverId,
                Email = RandomString(5) + "@test.com",
                Username = RandomString(5),
                Elo = new Elo(),
                Stats = new UserStats(),
            });
        }


        var handler = new GetAllFriendsByStatusRequestHandler(
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
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Once);
        foreach (var friendship in friendships) {
            _mockUserRepository.Verify(x => x.GetById(friendship.ReceiverId), Times.Once); 
        }
    }

    private List<Entities.Friendship> ReturnExampleFriendships(Guid userId, FriendshipStatus status) {

        var friendships = new List<Entities.Friendship>();

        for (int i = 0; i < 10; i++) {
            friendships.Add(new Entities.Friendship()
            {
                Id = Guid.NewGuid(),
                ReceiverId = Guid.NewGuid(),
                RequestorId = userId,
                Status = status,
            });
        }

        return friendships;
    }

    private static string RandomString(int length) {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
