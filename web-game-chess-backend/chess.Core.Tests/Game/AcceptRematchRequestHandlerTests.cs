
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.AcceptRematch;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using FluentAssertions;
using Moq;

namespace chess.Core.Tests.Game;

public class AcceptRematchRequestHandlerTests {

    
    private readonly Mock<IGameRepository> _mockGameRepository;
    private readonly Mock<IUserContextService> _mockUserContextService;
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;

    public AcceptRematchRequestHandlerTests() {
        _mockGameRepository = new Mock<IGameRepository>();
        _mockUserContextService = new Mock<IUserContextService>();
        _mockPlayerRepository = new Mock<IPlayerRepository>();
    }

    [Fact]
    public async Task Handle_Updates_Players_And_Returns_Dto_On_Success() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.Game(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockPlayerRepository.Setup(x => x.GetById(whitePlayer.Id)).ReturnsAsync(whitePlayer);
        _mockPlayerRepository.Setup(x => x.GetById(blackPlayer.Id)).ReturnsAsync(blackPlayer);
  


        var handler = new AcceptRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var result = await handler.Handle(request, CancellationToken.None);


        result.WhitePlayerUserId.Should().Be(userId);
        result.BlackPlayerUserId.Should().Be(friendId);

        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(whitePlayer), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(blackPlayer), Times.Once);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_Game_Does_Not_Exist() {

        var userId = Guid.NewGuid();
        var gameId = Guid.NewGuid();


        var request = new AcceptRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        // game not returned


        var handler = new AcceptRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_UnauthorizedException_When_User_Does_Not_Belong_To_Game() {

        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = Guid.NewGuid(), // user not in game
            GameId = gameId,
        };

        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.Game(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);


        var handler = new AcceptRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<UnauthorizedException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(It.IsAny<Guid>()), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }
    
    [Fact]
    public async Task Handle_Throws_NotFoundException_When_WhitePlayer_Not_Exists() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.Game(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        // white player not returned
  


        var handler = new AcceptRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Never);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }

    [Fact]
    public async Task Handle_Throws_NotFoundException_When_BlackPlayer_Not_Exists() {
        var userId = Guid.NewGuid();
        var friendId = Guid.NewGuid();
        var gameId = Guid.NewGuid();

        var whitePlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Username",
            UserId = userId,
            GameId = gameId,
        };

        var blackPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "Friend",
            UserId = friendId,
            GameId = gameId,
        };

        var game = new Entities.Game(){
            Id = gameId,
            WhitePlayerRegistered = true,
            BlackPlayerRegistered = true,

            WhitePlayerId = whitePlayer.Id,
            WhitePlayer = whitePlayer,
            BlackPlayerId = blackPlayer.Id,
            BlackPlayer = blackPlayer,
        };

        var request = new AcceptRematchRequest()
        {
            GameId = gameId,
        };


        _mockUserContextService.Setup(x => x.GetUserId()).Returns(userId);
        _mockGameRepository.Setup(x => x.GetById(gameId)).ReturnsAsync(game);
        _mockPlayerRepository.Setup(x => x.GetById(whitePlayer.Id)).ReturnsAsync(whitePlayer);
        // black player not returned
  


        var handler = new AcceptRematchRequestHandler(
            _mockGameRepository.Object,
            _mockUserContextService.Object,
            _mockPlayerRepository.Object
        );

        var act = () => handler.Handle(request, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
        _mockUserContextService.Verify(x => x.GetUserId(), Times.Once);
        _mockGameRepository.Verify(x => x.GetById(gameId), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(whitePlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.GetById(blackPlayer.Id), Times.Once);
        _mockPlayerRepository.Verify(x => x.Update(It.IsAny<Player>()), Times.Never);
    }
}
