
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.FriendshipRequests.GetFriendProfile;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class GetFriendProfileRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public GetFriendProfileRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Should_Return_UserProfile_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship() {
            Id = friendshipId,
            RequestorId = userId,
            ReceiverId = friendId,
            Status = FriendshipStatus.Accepted,
        };

        var exampleFriend = new Entities.User() {
            Id = friendId,
            Email = "test@test.com",
            Username = "Username",
            Country = "PL",

            Elo = new UserElo(),
            Stats = new UserStats(),
        };

        var request = new  GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);
        _mockUserRepository.Setup(x => x.GetById(friendId)).ReturnsAsync(exampleFriend);


        var handler = new GetFriendProfileRequestHandler(
             _mockUserContextService.Object,
             _mockFriendshipRepository.Object,
             _mockUserRepository.Object
         );

        var result = await handler.Handle(request, CancellationToken.None);


        result.Should().NotBeNull();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(friendId), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friendship_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();


        var request = new GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new GetFriendProfileRequestHandler(
             _mockUserContextService.Object,
             _mockFriendshipRepository.Object,
             _mockUserRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(Guid.NewGuid()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Own_Friendship() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            RequestorId = Guid.NewGuid(),
            ReceiverId = Guid.NewGuid(),
            Status = FriendshipStatus.Accepted,
        };


        var request = new GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new GetFriendProfileRequestHandler(
             _mockUserContextService.Object,
             _mockFriendshipRepository.Object,
             _mockUserRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(Guid.NewGuid()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_Friendship_Is_Not_Accepted() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            RequestorId = userId,
            ReceiverId = Guid.NewGuid(),
            Status = FriendshipStatus.Rejected,
        };


        var request = new GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new GetFriendProfileRequestHandler(
             _mockUserContextService.Object,
             _mockFriendshipRepository.Object,
             _mockUserRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(Guid.NewGuid()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Friend_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendshipId = Guid.NewGuid();

        var exampleFriendship = new Entities.Friendship()
        {
            Id = friendshipId,
            RequestorId = userId,
            ReceiverId = Guid.NewGuid(),
            Status = FriendshipStatus.Accepted,
        };


        var request = new GetFriendProfileRequest()
        {
            FriendshipId = friendshipId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockFriendshipRepository.Setup(x => x.GetById(request.FriendshipId)).ReturnsAsync(exampleFriendship);


        var handler = new GetFriendProfileRequestHandler(
             _mockUserContextService.Object,
             _mockFriendshipRepository.Object,
             _mockUserRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetById(request.FriendshipId), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(exampleFriendship.ReceiverId), Times.Once);
    }
}
