
using chess.Application.Repositories;
using chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class RespondToFriendRequestRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public RespondToFriendRequestRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Should_Update_Friendship_On_Success() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            ReceiverId = userId,
            RequestorId = Guid.NewGuid(),
            Status = FriendshipStatus.Pending,
        };

        var request = new RespondToFriendRequestRequest()
        {
            FriendshipId = friendshipId,
            IsAccepted = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(friendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new RespondToFriendRequestRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(exampleFriendship), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friendship_Does_Not_Exist() {

        var userId = Guid.NewGuid();

        var request = new RespondToFriendRequestRequest()
        {
            FriendshipId = Guid.NewGuid(),
            IsAccepted = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new RespondToFriendRequestRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Was_Requestor() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            ReceiverId = Guid.NewGuid(),
            RequestorId = userId,
            Status = FriendshipStatus.Pending,
        };

        var request = new RespondToFriendRequestRequest()
        {
            FriendshipId = friendshipId,
            IsAccepted = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(friendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new RespondToFriendRequestRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(exampleFriendship), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Respond_To_Not_Owned_Friendship() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            ReceiverId = Guid.NewGuid(),
            RequestorId = Guid.NewGuid(),
            Status = FriendshipStatus.Pending,
        };

        var request = new RespondToFriendRequestRequest()
        {
            FriendshipId = friendshipId,
            IsAccepted = true,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(friendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new RespondToFriendRequestRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(exampleFriendship), Times.Never);
    }
}
