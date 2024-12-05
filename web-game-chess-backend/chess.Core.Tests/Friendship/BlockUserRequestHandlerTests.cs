
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Requests.FriendshipRequests.BlockUser;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Friendship;

public class BlockUserRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IFriendshipRepository> _mockFriendshipRepository;

    public BlockUserRequestHandlerTests() { 
        _mockUserContextService = new Mock<IUserContextService>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockFriendshipRepository = new Mock<IFriendshipRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Existing_Friendship_On_Success() {

        var userId = Guid.NewGuid();
        var userToBlockId = Guid.NewGuid();

        var userToBlock = new Entities.User()
        {
            Id = userToBlockId,
            Email = "test@test.com",
            Username = "Username",
        };

        var friendship = new Entities.Friendship()
        {
            Status = FriendshipStatus.Accepted,
            ReceiverId = userId,
            RequestorId  = userToBlockId,
        };

        var request = new BlockUserRequest()
        {
            UserId = userToBlockId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userToBlockId)).ReturnsAsync(userToBlock);
        _mockFriendshipRepository.Setup(x => x.GetByUsersIds(userId, userToBlockId)).ReturnsAsync(friendship);


        var handler = new BlockUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(userId, userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(friendship), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);   
    }

    [Fact]
    public async Task Handle_Create_Friendship_With_Rejected_Status_If_Friendship_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var userToBlockId = Guid.NewGuid();

        var userToBlock = new Entities.User()
        {
            Id = userToBlockId,
            Email = "test@test.com",
            Username = "Username",
        };

        var request = new BlockUserRequest()
        {
            UserId = userToBlockId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userToBlockId)).ReturnsAsync(userToBlock);
        // friendship not returned


        var handler = new BlockUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().NotThrowAsync();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(userId, userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(It.IsAny<Entities.Friendship>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Is_Blocking_Itself() {

        var userId = Guid.NewGuid();
        var userToBlockId = Guid.NewGuid();

        var request = new BlockUserRequest()
        {
            UserId = userId, // try to block itself
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new BlockUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Update(It.IsAny<Entities.Friendship>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_UserToBlock_Not_Exists() {

        var userId = Guid.NewGuid();
        var userToBlockId = Guid.NewGuid();

        var request = new BlockUserRequest()
        {
            UserId = userToBlockId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // user not returned


        var handler = new BlockUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<NotFoundException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(It.IsAny<Guid>(), It.IsAny<Guid>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Update(It.IsAny<Entities.Friendship>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Block_Already_Blocked_User() {

        var userId = Guid.NewGuid();
        var userToBlockId = Guid.NewGuid();

        var userToBlock = new Entities.User()
        {
            Id = userToBlockId,
            Email = "test@test.com",
            Username = "Username",
        };

        var friendship = new Entities.Friendship()
        {
            Status = FriendshipStatus.Rejected, // already rejected friendship
            ReceiverId = userId,
            RequestorId = userToBlockId,
        };

        var request = new BlockUserRequest()
        {
            UserId = userToBlockId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockUserRepository.Setup(x => x.GetById(userToBlockId)).ReturnsAsync(userToBlock);
        _mockFriendshipRepository.Setup(x => x.GetByUsersIds(userId, userToBlockId)).ReturnsAsync(friendship);


        var handler = new BlockUserRequestHandler(
            _mockUserContextService.Object,
            _mockUserRepository.Object,
            _mockFriendshipRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);
        await act.Should().ThrowAsync<BadRequestException>();


        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockUserRepository.Verify(x => x.GetById(userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.GetByUsersIds(userId, userToBlockId), Times.Once);
        _mockFriendshipRepository.Verify(x => x.Update(It.IsAny<Entities.Friendship>()), Times.Never);
        _mockFriendshipRepository.Verify(x => x.Create(It.IsAny<Entities.Friendship>()), Times.Never);
    }
}
