
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.DeclineInvitation;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class DeclineInvitationRequestHandlerTests {

    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IGameInvitationRepository> _mockGameInvitationRepository;

    public DeclineInvitationRequestHandlerTests() {
        _mockUserContextService = new Mock<IUserContextService>();
        _mockGameRepository = new Mock<IGameRepository>();
        _mockGameInvitationRepository = new Mock<IGameInvitationRepository>();
    }

    [Fact]
    public async Task Handle_Should_Remove_Invitation_On_Success() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player() {
                Id = Guid.NewGuid(),
                Name = "User",
                UserId = userId,
            },
            BlackPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Friend",
                UserId = Guid.NewGuid(),
            },
        };

        var invitation = new GameInvitation()
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
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<GameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throw_BadRequestException_When_User_Is_Not_Player_Of_Game() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "OtherUser",
                UserId = Guid.NewGuid(), // user is not a player
            },
            BlackPlayer = new Player()
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
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<GameInvitation>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throw_NotFoundException_When_Invitation_Does_Not_Exists() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var game = new Entities.Game()
        {
            Id = gameId,

              WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,
            WhitePlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "User",
                UserId = userId,
            },
            BlackPlayer = new Player()
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
        _mockGameInvitationRepository.Verify(x => x.Delete(It.IsAny<GameInvitation>()), Times.Never);
    }
}
