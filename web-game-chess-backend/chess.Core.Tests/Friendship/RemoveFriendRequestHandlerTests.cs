using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Requests.FriendshipRequests.RemoveFriend;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class RemoveFriendRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public RemoveFriendRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Should_Create_Pending_Friendship_On_Success() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            ReceiverId = userId,
            RequestorId = Guid.NewGuid(),
            Status = FriendshipStatus.Pending,
        };

        var request = new RemoveFriendRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);
 

        var handler = new RemoveFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Delete(exampleFriendship), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friendship_Does_Not_Exist() {

        var userId = Guid.NewGuid();

        var request = new RemoveFriendRequest()
        {
            FriendshipId = Guid.NewGuid(),
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new RemoveFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Delete(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Own_Friendship() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            ReceiverId = Guid.NewGuid(),
            RequestorId = Guid.NewGuid(),
            Status = FriendshipStatus.Pending,
        };

        var request = new RemoveFriendRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new RemoveFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Delete(exampleFriendship), Times.Never);
    }
}
