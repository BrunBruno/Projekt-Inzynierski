
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.AcceptInvitation;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class AcceptInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGamePlayerRepository> _mockPlayerRepository;
    private readonly Mock<IWebGameInvitationRepository> _mockGameInvitationRepository;

    public AcceptInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IWebGamePlayerRepository>();
        _mockGameInvitationRepository = new Mock<IWebGameInvitationRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Players_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new WebGamePlayer()
        {
            Name = "Username",
            UserId = userId,
        };

        var inviterPlayer = new WebGamePlayer()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var gameInvitation = new WebGameInvitation()
        {
            GameId = gameId,
            InviterId = friendId,
            InviteeId = userId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InviterId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviterId, gameId)).ReturnsAsync(inviterPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);
        _mockGameInvitationRepository.Setup(x => x.GetByGameId(gameId)).ReturnsAsync(gameInvitation);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviterId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviteeId, gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(inviterPlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Update(gameInvitation), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_InviterPlayer_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InviterId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // first player not exists


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviterId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviteeId, gameId), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Update(It.IsAny<WebGameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_InviteePlayer_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviterPlayer = new WebGamePlayer()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InviterId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviterId, gameId)).ReturnsAsync(inviterPlayer);
        // second player not exists



        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviterId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviteeId, gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviterPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<WebGamePlayer>()), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Update(It.IsAny<WebGameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Is_Not_Invitee() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new WebGamePlayer()
        {
            Name = "Friend",
            UserId = friendId, // friend is invitee
        };

        var inviterPlayer = new WebGamePlayer()
        {
            Name = "Username",
            UserId = userId, // user is inviter
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InviterId = userId,
            InviteeId = friendId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviterId, gameId)).ReturnsAsync(inviterPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviterId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviteeId, gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviterPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Update(It.IsAny<WebGameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Invitation_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new WebGamePlayer()
        {
            Name = "Username",
            UserId = userId,
        };

        var inviterPlayer = new WebGamePlayer()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InviterId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviterId, gameId)).ReturnsAsync(inviterPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdAndGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);
        // invitation not exists


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockGameInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviterId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdAndGameId(request.InviteeId, gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(inviterPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Update(It.IsAny<WebGameInvitation>()), Times.Never);
    }
}
