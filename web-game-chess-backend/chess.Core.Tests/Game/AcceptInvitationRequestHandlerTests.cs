
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.AcceptInvitation;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class AcceptInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly Mock<IInvitationRepository> _mockInvitationRepository;

    public AcceptInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _mockInvitationRepository = new Mock<IInvitationRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Players_On_Success() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new Player()
        {
            Name = "Username",
            UserId = userId,
        };

        var invitorPlayer = new Player()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var gameInvitation = new Invitation()
        {
            GameId = gameId,
            InvitorId = friendId,
            InviteeId = userId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InvitorId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InvitorId, gameId)).ReturnsAsync(invitorPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);
        _mockInvitationRepository.Setup(x => x.GetByGameId(gameId)).ReturnsAsync(gameInvitation);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InvitorId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InviteeId, gameId), Times.Once);
        _mockInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(invitorPlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Once);
        _mockInvitationRepository.Verify(x => x.Update(gameInvitation), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_InvitorPlayer_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InvitorId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InvitorId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InviteeId, gameId), Times.Never);
        _mockInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
        _mockInvitationRepository.Verify(x => x.Update(It.IsAny<Invitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_InviteePlayer_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var invitorPlayer = new Player()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InvitorId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InvitorId, gameId)).ReturnsAsync(invitorPlayer);



        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InvitorId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InviteeId, gameId), Times.Once);
        _mockInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(invitorPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
        _mockInvitationRepository.Verify(x => x.Update(It.IsAny<Invitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_BadRequestException_When_User_Is_Not_Invitee() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new Player()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var invitorPlayer = new Player()
        {
            Name = "Username",
            UserId = userId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InvitorId = userId,
            InviteeId = friendId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InvitorId, gameId)).ReturnsAsync(invitorPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InvitorId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InviteeId, gameId), Times.Once);
        _mockInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(invitorPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Never);
        _mockInvitationRepository.Verify(x => x.Update(It.IsAny<Invitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Invitation_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var inviteePlayer = new Player()
        {
            Name = "Username",
            UserId = userId,
        };

        var invitorPlayer = new Player()
        {
            Name = "Friend",
            UserId = friendId,
        };

        var request = new AcceptInvitationRequest()
        {
            GameId = gameId,
            InvitorId = friendId,
            InviteeId = userId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InvitorId, gameId)).ReturnsAsync(invitorPlayer);
        _mockPlayerRepository.Setup(x => x.GetByUserIdandGameId(request.InviteeId, gameId)).ReturnsAsync(inviteePlayer);


        var handler = new AcceptInvitationRequestHandler(
            _mockPlayerRepository.Object,
            _mockUserContextService.Object,
            _mockInvitationRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InvitorId, gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetByUserIdandGameId(request.InviteeId, gameId), Times.Once);
        _mockInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(invitorPlayer), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(inviteePlayer), Times.Never);
        _mockInvitationRepository.Verify(x => x.Update(It.IsAny<Invitation>()), Times.Never);
    }
}
