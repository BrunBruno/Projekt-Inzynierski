
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class GetFriendshipRankingRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public GetFriendshipRankingRequestHandlerTests() {
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
    }

    [Fact]
    public async Task Handle_Returns_PagedResult_Of_UsersRanking_On_Success() {

        var userId = Guid.NewGuid();
        var friendsIds = ReturnExampleUserIdList();

        var user = new Entities.User()
        {
            Id = userId,
            Email = "test@test.com",
            Username = "Username",

            Stats = new UserStats(),
            Elo = new UserElo(),
        };

        var request = new GetFriendshipRankingRequest()
        {
            PageNumber = 1,
            PageSize = 10,
            Type = TimingTypes.Classic,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userId)).ReturnsAsync(user);
        _mockFriendshipRepository.Setup(x => x.GetAllFriendIds(userId, FriendshipStatus.Accepted)).ReturnsAsync(friendsIds);
        _mockUserRepository.Setup(x => x.GetAllFriends(friendsIds, userId)).ReturnsAsync(ReturnExampleUserList());

        var handler = new GetFriendshipRankingRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);
        result.Items.Count.Should().Be(10);  

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllFriendIds(userId, FriendshipStatus.Accepted), Times.Once);
        _mockUserRepository.Verify(x => x.GetAllFriends(friendsIds, userId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Does_Not_Exists() {

        var userId = Guid.NewGuid();


        var request = new GetFriendshipRankingRequest()
        {
            PageNumber = 1,
            PageSize = 10,
            Type = TimingTypes.Classic,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned

        var handler = new GetFriendshipRankingRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllFriendIds(It.IsAny<Guid>(), FriendshipStatus.Accepted), Times.Never);
        _mockUserRepository.Verify(x => x.GetAllFriends(It.IsAny<List<Guid>>(), It.IsAny<Guid>()), Times.Never);
    }

    private static List<Guid> ReturnExampleUserIdList() { 
        
        var userIdList = new List<Guid>();

        for (var i = 0; i < 10; i++) { 
            userIdList.Add(Guid.NewGuid());
        }

        return userIdList;
    }

    private static List<Entities.User> ReturnExampleUserList() { 
    
        var users = new List<Entities.User>();

        for (var i = 0; i < 10; i++) {
            users.Add(new Entities.User() { 
                Email = "test@test.com",
                Username = "Username",

                Stats = new UserStats(),
                Elo = new UserElo(),
            });
        }

        return users;
    }
}
