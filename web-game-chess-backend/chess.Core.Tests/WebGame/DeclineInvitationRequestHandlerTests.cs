
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Requests.WebGameRequests.DeclineInvitation;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.WebGame;

public class DeclineInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IWebGameRepository> _mockGameRepository;
    private readonly Mock<IWebGameInvitationRepository> _mockGameInvitationRepository;

    public DeclineInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IWebGameRepository>();
        _mockGameInvitationRepository = new Mock<IWebGameInvitationRepository>();
    }

    [Fact]
    public async Task Handle_Should_Remove_Invitation_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer() {
                Id = Guid.NewGuid(),
                Name = "User",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Friend",
                UserId = Guid.NewGuid(),
            },
        };

        var invitation = new WebGameInvitation()
        { 
            Id = Guid.NewGuid(),
            GameId = gameId,
        };

        var request = new DeclineInvitationRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockGameInvitationRepository.Setup(x => x.GetByGameId(gameId)).ReturnsAsync(invitation);


        var handler = new DeclineInvitationRequestHandler(
             _mockUserContextService.Object,
             _mockGameRepository.Object,
             _mockGameInvitationRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().NotThrowAsync();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Delete(invitation), Times.Once);
    }

    [Fact]
    public async Task Handle_Throw_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();
 
        var request = new DeclineInvitationRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new DeclineInvitationRequestHandler(
             _mockUserContextService.Object,
             _mockGameRepository.Object,
             _mockGameInvitationRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<WebGameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throw_BadRequestException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "OtherUser",
                UserId = Guid.NewGuid(), // user is not a player
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Friend",
                UserId = Guid.NewGuid(), // user is not a player
            },
        };

        var request = new DeclineInvitationRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new DeclineInvitationRequestHandler(
             _mockUserContextService.Object,
             _mockGameRepository.Object,
             _mockGameInvitationRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<BadRequestException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Never);
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<WebGameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throw_NotFoundException_When_Invitation_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.WebGame()
        {
            Id = gameId,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "User",
                UserId = userId,
            },
            BlackPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Friend",
                UserId = Guid.NewGuid(),
            },
        };

        var request = new DeclineInvitationRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // game invitation not returned


        var handler = new DeclineInvitationRequestHandler(
             _mockUserContextService.Object,
             _mockGameRepository.Object,
             _mockGameInvitationRepository.Object
         );

        var act = () => handler.Handle(request, CancellationToken.None);


        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.GetByGameId(gameId), Times.Once);
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<WebGameInvitation>()), Times.Never);
    }
}
