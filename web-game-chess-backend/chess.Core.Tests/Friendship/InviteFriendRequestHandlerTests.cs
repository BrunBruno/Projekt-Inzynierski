
using chess.Application.Repositories;
using chess.Application.Requests.FriendshipRequests.InviteFriend;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class InviteFriendRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public InviteFriendRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Should_Create_Pending_Freindship_On_Success() {

        var userId = Guid.NewGuid();

        var exampleFriend = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
        };

        var request = new InviteFriendRequest()
        {
            ReceiverId = exampleFriend.Id,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(request.ReceiverId)).ReturnsAsync(exampleFriend);
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted)).ReturnsAsync(new List<Entities.Friendship>());
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending)).ReturnsAsync(new List<Entities.Friendship>());
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected)).ReturnsAsync(new List<Entities.Friendship>());


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Once);
    }

    [Fact]
    public async Task Hendle_Throws_BadRequestExeption_When_User_Invites_Itself() {

        var userId = Guid.NewGuid();

        var request = new InviteFriendRequest()
        {
            ReceiverId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_User_Not_Exists() {

        var userId = Guid.NewGuid();

        var request = new InviteFriendRequest()
        {
            ReceiverId = Guid.NewGuid(),
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Has_Accepted_Friendship() {

        var exampleFriend = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
        };

        var userId = Guid.NewGuid();

        var request = new InviteFriendRequest()
        {
            ReceiverId = exampleFriend.Id,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(request.ReceiverId)).ReturnsAsync(exampleFriend);
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted)).ReturnsAsync(new List<Entities.Friendship>() {
            new()
            {
                RequestorId = userId,
                ReceiverId =  exampleFriend.Id,
                Status = FriendshipStatus.Accepted,
            }
        });


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Has_Pending_Friendship() {

        var exampleFriend = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
        };

        var userId = Guid.NewGuid();

        var request = new InviteFriendRequest()
        {
            ReceiverId = exampleFriend.Id,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(request.ReceiverId)).ReturnsAsync(exampleFriend);
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted)).ReturnsAsync(new List<Entities.Friendship>());
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending)).ReturnsAsync(new List<Entities.Friendship>() {
            new()
            {
                RequestorId = userId,
                ReceiverId =  exampleFriend.Id,
                Status = FriendshipStatus.Pending,
            }
        });


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Has_Rejected_Friendship() {

        var exampleFriend = new Entities.User()
        {
            Id = Guid.NewGuid(),
            Email = "friend@test.com",
            Username = "Friend",
        };

        var userId = Guid.NewGuid();

        var request = new InviteFriendRequest()
        {
            ReceiverId = exampleFriend.Id,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(request.ReceiverId)).ReturnsAsync(exampleFriend);
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted)).ReturnsAsync(new List<Entities.Friendship>());
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending)).ReturnsAsync(new List<Entities.Friendship>());
        _mockFriendshipRepository.Setup(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected)).ReturnsAsync(new List<Entities.Friendship>() {
            new()
            {
                RequestorId = userId,
                ReceiverId =  exampleFriend.Id,
                Status = FriendshipStatus.Rejected,
            }
        });


        var handler = new InviteFriendRequestHandler(
            _mockFriendshipRepository.Object,
            _mockUserContextService.Object,
            _mockUserRepository.Object
        );


        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(request.ReceiverId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Accepted), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Pending), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetAllForUserByStatus(userId, FriendshipStatus.Rejected), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }
}
